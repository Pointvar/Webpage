if __name__ == "__main__":
    import os, sys

    dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Webpage"))
    sys.path.append(dir_path)
    from compass_warp.compass_conf.set_env import set_path_env

    set_path_env()

import re
import json
import requests
import jieba
from collections import ChainMap
from functools import reduce
from itertools import product
from furl import furl
from random import randint
from bs4 import BeautifulSoup
from string import digits, ascii_letters, punctuation
from concurrent.futures import ThreadPoolExecutor

from pdd_models.add_pdd_goods import AddPddGoods
from pdd_models.get_pdd_goods_spec import GetPddGoodsSpec
from pdd_models.get_pdd_goods_spec_id import GetPddGoodsSpecId
from pdd_models.upload_pdd_goods_image_feature import UploadPddGoodsImageFeature
from pdd_models.get_pdd_goods_outer_cat_mapping import GetPddGoodsOuterCatMapping
from pdd_models.get_pdd_goods_cat_rule import GetPddGoodsCatRule
from pdd_models.get_pdd_goods_logistics_template import GetPddGoodsLogisticsTemplate
from pdd_models.cats_pdd_goods_authorization import CatsPddGoodsAuthorization
from pdd_models.get_pdd_goods_commit_status import GetPddGoodsCommitStatus
from pdd_models.set_pdd_goods_sale_status import SetPddGoodsSaleStatus

from db_models.category_infos.pdd_category_db import PddCategoryDB
from db_models.copy_infos.simple_task_db import CopySimpleTaskDB
from db_models.copy_infos.complex_task_db import CopyComplexTaskDB
from db_models.copy_infos.pdd_sku_match_db import CopyPddSkuMatchDB
from db_models.copy_infos.pdd_prop_match_db import CopyPddPropMatchDB

import logging

logger = logging.getLogger(__name__)


# from spider_servers.proxy_agent_server.proxy_client import ProxyClient


class CopyService:
    def __init__(self, sid, nick, platform, soft_code, source):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_code = soft_code
        self.source = source
        self.user_info = dict(sid=sid, nick=nick, platform=platform, soft_code=soft_code)
        self.pdd_cat_map_api = GetPddGoodsOuterCatMapping(self.user_info, self.source)
        self.pdd_get_cat_rule_api = GetPddGoodsCatRule(self.user_info, self.source)
        self.pdd_get_spec_api = GetPddGoodsSpec(self.user_info, self.source)
        self.pdd_get_spec_id_api = GetPddGoodsSpecId(self.user_info, self.source)
        self.pdd_add_item_api = AddPddGoods(self.user_info, self.source)
        self.pdd_upload_image_feature_api = UploadPddGoodsImageFeature(self.user_info, self.source)
        self.pdd_get_logistic_api = GetPddGoodsLogisticsTemplate(self.user_info, self.source)
        self.pdd_get_auth_cats_api = CatsPddGoodsAuthorization(self.user_info, self.source)
        self.pdd_get_commit_status_api = GetPddGoodsCommitStatus(self.user_info, self.source)
        self.pdd_set_goods_status_api = SetPddGoodsSaleStatus(self.user_info, self.source)
        self.pdd_categroy_db = PddCategoryDB(sid, nick, platform, soft_code)
        self.copy_simple_task_db = CopySimpleTaskDB(sid, nick, platform, soft_code)
        self.copy_complex_task_db = CopyComplexTaskDB(sid, nick, platform, soft_code)
        # self.copy_pdd_sku_match = CopyPddSkuMatchDB(sid, nick, platform, soft_code)
        # self.copy_pdd_prop_match = CopyPddPropMatchDB(sid, nick, platform, soft_code)

    def _get_copy_url_info(self, copy_url):
        parser_dict = furl(copy_url)
        host = parser_dict.host
        if "taobao" in host:
            item_source = "#TAOBAO#"
            num_iid = parser_dict.args["id"]
            parser_dict.args = dict(id=num_iid)
        elif "tmall" in host:
            item_source = "#TIANMAO#"
            num_iid = parser_dict.args["id"]
            parser_dict.args = dict(id=num_iid)
        parsed_url = parser_dict.url
        return item_source, int(num_iid), parsed_url

    def _get_process_price(self, price_dict, price):
        max_price = price * 1.08
        times, operator, offset = [price_dict[key] for key in ["times", "operator", "offset"]]
        price = price * times / 100 + offset if operator == "#ADD#" else price * times / 100 - offset
        price = price if price <= max_price else max_price
        return int(price * 100)

    def _get_process_title(self, title, item_cut, title_count):
        single_chars = digits + ascii_letters + punctuation
        count, process_titles = 0, []
        title = title[::-1] if item_cut == "#END#" else title
        for process_title in title:
            if process_title in single_chars:
                count += 1
            else:
                count += 2
            if count > title_count:
                break
            process_titles.append(process_title)
        process_titles = process_titles[::-1] if item_cut == "#END#" else process_titles
        title = "".join(process_titles)
        return title

    def _combine_sku_props(self, sku_props, sku_infos):
        if len(sku_props) <= 2:
            return sku_props, sku_infos
        # 合并超过2组的sku信息
        vid_maps = {}
        combine_props = sku_props[1:]
        for combine_prop in combine_props[1:]:
            for value in combine_prop["values"]:
                value["vid"] = ":".join([combine_prop["pid"], value["vid"]])
        combine_values = map(lambda x: x["values"], combine_props)
        for product_values in product(*combine_values):
            old_vid, vid, name = product_values[0]["vid"], "", ""
            for product_value in product_values:
                vid += product_value["vid"]
                name += product_value["name"]
            vid_maps[old_vid] = dict(vid=vid, name=name)

        process_props = sku_props[:2]
        for value in process_props[1]["values"]:
            value.update(vid_maps[value["vid"]])

        for sku_info in sku_infos:
            prop_paths = sku_info["propPath"].split(";")
            propPath = ";".join([prop_paths[0], "".join(prop_paths[1:])])
            sku_info["propPath"] = propPath
        return process_props, sku_infos

    def _get_match_prop_name(self, spec_names, input_name, choose_names=[]):
        # 获取合适的prop_name
        # input_name: ['颜色' 10, '分类' 8] spec_names['颜色'] 10 ['分类'] 8 ['颜色', '类型'] 10分 ['颜色', '分类'] 18分
        split_names = list(jieba.cut(input_name))
        score_infos = []
        for index, spec_name in enumerate(spec_names):
            scores = []
            for split_spec in spec_name:
                score = 10 - split_names.index(split_spec) * 2 if split_spec in split_names else 0
                scores.append(score)
            score_info = dict(index=index, score=sum(scores), quantity=len(scores), spec_name="".join(spec_name))
            score_infos.append(score_info)
        score_infos = [x for x in score_infos if x["score"] != 0 and x["spec_name"] not in choose_names]
        if score_infos:
            max_score = max(map(lambda x: x["score"], score_infos))
            max_scores = [x for x in score_infos if x["score"] == max_score]
            match_name = sorted(max_scores, key=lambda x: x["quantity"])[0]["spec_name"]
        else:
            match_name = None
        return match_name

    def _get_pdd_prop_names(self, propertie_rule, propertie_rules, ref_maps):
        propertie_names = {x["ref_pid"]: x["name"] for x in propertie_rules}
        ref_pids = [propertie_rule["ref_pid"]]
        pdd_prop_names = []
        while ref_pids:
            ref_pid = ref_pids.pop()
            pdd_prop_names.append(propertie_names[ref_pid])
            last_ref_pids = [x[1] for x in ref_maps if x[0] == ref_pid]
            ref_pids.extend(last_ref_pids)
        return pdd_prop_names

    def _get_response_by_url(self, url):
        resp = requests.get(url, timeout=10)
        return resp.content

    def get_logistic_templates(self):
        # 获取后台的运费模版信息
        logistic_templates = self.pdd_get_logistic_api.get_pdd_goods_logistics_template()
        return logistic_templates

    def get_authorize_cats(self):
        # 获取用户可发布的类目
        authorize_cats = self.pdd_get_auth_cats_api.cats_pdd_goods_authorization(0)
        pdd_categorys = self.pdd_categroy_db.get_pdd_categorys()
        category_maps = {}
        for pdd_category in pdd_categorys:
            parent_cat_id = pdd_category["parent_cat_id"]
            category_maps.setdefault(parent_cat_id, [])
            category_maps[parent_cat_id].append(pdd_category)

        combine_cats = []
        while authorize_cats:
            authorize_cat = authorize_cats.pop()
            if "leaf" in authorize_cat:
                combine_cats.append(authorize_cat)
            cat_id = authorize_cat["cat_id"]
            authorize_cat["child_cats"] = category_maps.get(cat_id, [])
            authorize_cats.extend(authorize_cat["child_cats"])
        return combine_cats

    def save_copy_task(self, copy_urls, item_set, price_set, advanced_set):
        # 保存复制任务
        amount, filter_urls, invalid_urls, valid_urls = len(copy_urls), [], [], []
        task_id = self.copy_simple_task_db.save_simple_task(item_set, price_set, advanced_set, amount)
        for index, copy_url in enumerate(copy_urls):
            try:
                item_source, num_iid, parsed_url = self._get_copy_url_info(copy_url)
            except Exception as ex:
                invalid_urls.append(copy_url)
                continue

            if item_set["filter_same"]:
                same_mark = self.copy_complex_task_db.get_same_complex_task(parsed_url)
                if same_mark:
                    filter_urls.append(copy_url)
                    continue
            self.copy_complex_task_db.save_complex_task(task_id, copy_url, item_source, num_iid, parsed_url, index, amount)
            valid_urls.append(copy_url)
        return copy_urls, filter_urls, invalid_urls, valid_urls

    def get_copy_simple_task(self, task_id):
        return self.copy_simple_task_db.get_simple_task_by_id(task_id)

    def get_show_complex_tasks(self):
        complex_tasks = self.copy_complex_task_db.get_show_complex_tasks()
        return complex_tasks

    def get_wait_copy_complex_task(self):
        copy_task = self.copy_complex_task_db.get_wait_complex_task()
        return copy_task

    def get_check_copy_complex_task(self):
        copy_task = self.copy_complex_task_db.get_check_complex_task()
        return copy_task

    def update_complex_task_by_params(self, in_ids, update_dict):
        if not isinstance(in_ids, list):
            in_ids = [in_ids]
        self.copy_complex_task_db.update_complex_task_by_params(in_ids, update_dict)

    def get_taobao_item_api(self, num_iid):
        input_params = dict(id=num_iid, apikey="uM4cTtNKxeCFH4K4i4pj5IHRo8KdJVjZ", info="all")
        item_dict = {}
        for count in range(3):
            try:
                resp = requests.get("http://api.ds.dingdanxia.com/shop/good_info", input_params, timeout=10)
                resp = resp.json()
                if resp["code"] == 200 and resp["data"]["data"]:
                    item_dict = resp["data"]["data"]
                    break
            except Exception as e:
                pass
        return item_dict

    def parse_taobao_item_api(self, item_dict):
        # 解析订单侠淘宝商品信息

        # 基本信息解析
        keys = ["itemId", "title", "images", "categoryId", "rootCategoryId"]
        num_iid, title, main_pics, category_id, root_category_id = [item_dict["item"][key] for key in keys]
        main_pics = list(map(lambda x: "https:" + x, main_pics))

        # desc_url = "https://detail.tmall.com/templates/pages/desc?id={0}".format(num_iid)
        # desc_html = self._get_response_by_url(desc_url)
        detail_pics = []
        keys = ["skuBase", "props"]
        sku_base, props = [item_dict[key] for key in keys]
        mock_data = item_dict["apiStack"][0]["value"]
        # SKU信息和价格
        sku_props = sku_base["props"]
        for sku_prop in sku_props:
            for value in sku_prop["values"]:
                if "image" in value:
                    value["image"] = "https:" + value["image"]

        sku_infos = sku_base["skus"]
        sku_prices = json.loads(mock_data)["skuCore"]["sku2info"]
        for sku_info in sku_infos:
            sku_price = sku_prices[sku_info["skuId"]]
            sku_quantity = int(sku_price["quantity"])
            sku_price = float(sku_price["price"]["priceText"])
            sku_info.update(sku_quantity=sku_quantity, sku_price=sku_price)

        # 基本属性和销售属性解析
        base_props = props["groupProps"][0]["基本信息"]
        item_price = max(map(lambda x: x["sku_price"], sku_infos))

        item_info = dict(
            base_info=dict(main_pics=main_pics, title=title, detail_pics=detail_pics),
            props_info=dict(base_props=base_props, sku_props=sku_props),
            sale_info=dict(item_price=item_price, sku_infos=sku_infos),
            category_info=dict(category_id=category_id, root_category_id=root_category_id, category_name=""),
        )
        return item_info

    def parser_item_to_pdd(self, item_info, item_set, price_set, advanced_set):
        # 转换商品信息为拼多多提交数据
        # 提交信息初始化
        keys = ["shipment_type", "item_stock", "item_cut"]
        shipment_type_set, item_stock_set, item_cut_set = [advanced_set[key] for key in keys]
        if shipment_type_set == "#HOUR24#":
            shipment_second = 24 * 3600
            fast_delivery = 0
        elif shipment_type_set == "#HOUR48#":
            shipment_second = 48 * 3600
            fast_delivery = 0
        else:
            shipment_second = 0
            fast_delivery = 1

        keys = ["ship_id", "categray_type"]
        ship_id, categray_type = [item_set[key] for key in keys]
        pdd_submit = dict(
            cost_template_id=ship_id,  # 运费模版
            customer_num=2,  # 拼单人数
            is_folt=True,  # 假一赔十
            goods_type=1,  # 商品类型
            country_id=0,  # 国家类型
            second_hand=False,  # 二手
            shipment_limit_second=shipment_second,  # 发货时间
            delivery_one_day=fast_delivery,  # 当日发货
            is_pre_sale=False,  # 预售
            is_refundable=True,  # 7天无理由
        )
        # 基本信息提取
        keys = ["base_info", "props_info", "sale_info", "category_info"]
        base_info, props_info, sale_info, category_info = [item_info[key] for key in keys]
        main_pics, title = [base_info[key] for key in ["main_pics", "title"]]
        base_props, sku_props = [props_info[key] for key in ["base_props", "sku_props"]]
        base_props = dict(ChainMap(*base_props))
        if categray_type == "#AUTO#":
            category_id, category_name = [category_info[key] for key in ["category_id", "category_name"]]
            item_price, sku_infos = [sale_info[key] for key in ["item_price", "sku_infos"]]
            item_price = int(item_price)
            # 商品类目关系映射 拼多多提供的API
            category_info = self.pdd_cat_map_api.get_pdd_goods_outer_cat_mapping(category_id, category_name, title)
            category_id = list(filter(bool, category_info))[-1]
        else:
            category_id = list(filter(bool, item_set["custom_category"]))[-1]

        # 处理商品属性规则
        category_rule = self.pdd_get_cat_rule_api.get_pdd_goods_cat_rule(category_id)
        propertie_rules = category_rule["goods_properties_rule"]["properties"]
        # prop_maps = self.copy_pdd_sku_match.get_pdd_sku_matchs('taobao')
        prop_maps = {}  # TODO 属性对应关系数据库化
        choose_names, goods_properties, remove_ref_pids, process_pdd_prop_names = {}, [], [], []
        base_prop_names = list(map(lambda x: list(jieba.cut(x)), base_props.keys()))

        ref_maps = []
        for propertie_rule in propertie_rules:
            ref_pid = propertie_rule["ref_pid"]
            parent_ref_pids = [x["parent_ref_pid"] for x in propertie_rule.get("show_condition", [])]
            ref_map = [[x, ref_pid] for x in parent_ref_pids]
            ref_maps.extend(ref_map)

        for propertie_rule in propertie_rules:
            keys = ["name", "choose_max_num", "input_max_num", "ref_pid", "property_value_type", "is_sale", "required"]
            src_pdd_prop_name, choose_max_num, input_max_num, ref_pid, prop_type, is_sale, required = [
                propertie_rule[key] for key in keys
            ]
            # SKU相关的信息,直接跳过
            if is_sale:
                continue
            # 属性是否可自定义
            custom_mark = True if choose_max_num == 0 and input_max_num != 0 else False
            # 寻找原属姓名和拼多多匹配的
            # 考虑属性依赖的情况，多层属性每次匹配下。
            pdd_prop_names = self._get_pdd_prop_names(propertie_rule, propertie_rules, ref_maps)
            for pdd_prop_name in pdd_prop_names:
                if pdd_prop_name in prop_maps:
                    propertie_name = prop_maps[pdd_prop_name]
                else:
                    # 可以选择依赖的属性值
                    pass_pdd_prop_names = [x for x in process_pdd_prop_names if pdd_prop_name in x]
                    pass_pdd_prop_names = reduce(lambda x, y: x + y, pass_pdd_prop_names, [])
                    filter_choose_names = [value for key, value in choose_names.items() if key not in pass_pdd_prop_names]
                    propertie_name = self._get_match_prop_name(base_prop_names, pdd_prop_name, filter_choose_names)
                    logger.info(
                        "[PROP MATCH] src_name:%s dst_name:%s pre_choose_names:%s choosed_names%s filter_choose_names:%s",
                        pdd_prop_name,
                        propertie_name,
                        base_prop_names,
                        choose_names,
                        filter_choose_names,
                    )
                if propertie_name:
                    break
            # 没找到合适的属性名
            if not propertie_name:
                if required:
                    remove_ref_pids.append(ref_pid)
                continue

            choose_names[src_pdd_prop_name] = propertie_name
            if len(pdd_prop_names) > 1:
                process_pdd_prop_names.append(pdd_prop_names)
            choose_values = propertie_rule.get("values", [])  # 可选项
            src_propertie_value = base_props[propertie_name]
            split_choose_values = list(map(lambda x: list(jieba.cut(x["value"])), choose_values))
            propertie_value = self._get_match_prop_name(split_choose_values, src_propertie_value)
            logger.info(
                "[PROP VALUE MATCH] src_name:%s dst_name:%s pre_choose_names:%s",
                src_propertie_value,
                propertie_value,
                split_choose_values,
            )
            # 没找到合适的属性值
            if not propertie_value and not custom_mark:
                if required:
                    remove_ref_pids.append(ref_pid)
                continue

            prop_dict = {}
            choose_values = [x for x in choose_values if x["value"] == propertie_value]
            if choose_values:
                vid = choose_values[0]["vid"]
                prop_dict = dict(ref_pid=ref_pid, vid=vid)
            else:
                if prop_type == 0:
                    value = str(propertie_value)
                    prop_dict = dict(ref_pid=ref_pid, value=value)
                elif prop_type == 1:
                    numbers = re.findall("\d+", str(propertie_value))
                    if numbers:
                        value = int(numbers[0])
                        prop_dict = dict(ref_pid=ref_pid, value=value)
            # 没有效的属性值
            if not prop_dict:
                if required:
                    remove_ref_pids.append(ref_pid)
                continue
            goods_properties.append(prop_dict)
        # 检查goods_properties
        delect_ref_pids = []
        for remove_ref_pid in remove_ref_pids:
            delect_ref_pids.append(remove_ref_pid)
            for ref_map in ref_maps:
                if remove_ref_pid in ref_map:
                    delect_ref_pids.extend(ref_map)
        delect_ref_pids = list(set(delect_ref_pids))
        goods_properties = [x for x in goods_properties if x["ref_pid"] not in delect_ref_pids]

        title_count = 60
        title = self._get_process_title(title, item_cut_set, title_count)
        pdd_submit.update(
            goods_desc=title, goods_name=title, cat_id=category_id, carousel_gallery=main_pics, detail_gallery=main_pics
        )

        market_price = self._get_process_price(price_set["market_price"], item_price)

        pdd_submit.update(market_price=market_price, goods_properties=goods_properties)
        # 处理销售属性
        # sku_maps = self.copy_pdd_sku_match.get_pdd_sku_matchs('taobao')
        sku_maps = {"颜色分类": "颜色"}  # TODO sku对应关系数据库化
        pdd_skus = self.pdd_get_spec_api.get_pdd_goods_spec(category_id)
        pdd_skus = {pdd_sku["parent_spec_name"]: pdd_sku["parent_spec_id"] for pdd_sku in pdd_skus}
        pdd_spec_names = list(map(lambda x: list(jieba.cut(x)), pdd_skus.keys()))
        sku_props, sku_infos = self._combine_sku_props(sku_props, sku_infos)
        spec_id_maps, sku_image_maps, choose_names = {}, {}, []
        for sku_prop in sku_props:
            sku_prop_id, src_sku_prop_name, sku_prop_values = [sku_prop[key] for key in ["pid", "name", "values"]]
            if src_sku_prop_name in sku_maps:
                sku_prop_name = sku_maps[src_sku_prop_name]
            else:
                sku_prop_name = self._get_match_prop_name(pdd_spec_names, src_sku_prop_name, choose_names)
                logger.info(
                    "[SKU MATCH]src_name:%s dst_name:%s pre_choose_names:%s choosed_names%s",
                    src_sku_prop_name,
                    sku_prop_name,
                    pdd_spec_names,
                    choose_names,
                )
                if not sku_prop_name:
                    sku_prop_name = [x for x in pdd_skus.keys() if x not in choose_names][0]
            choose_names.append(sku_prop_name)
            pdd_parent_id = pdd_skus[sku_prop_name]
            for sku_prop_value in sku_prop_values:
                value_id = sku_prop_value["vid"]
                value_name = sku_prop_value["name"]
                value_image = sku_prop_value.get("image")
                value_name = value_name[:18]
                pdd_spec_id = self.pdd_get_spec_id_api.get_pdd_goods_spec_id(pdd_parent_id, value_name)
                spec_id_key = ":".join(map(str, [sku_prop_id, value_id]))
                spec_id_maps[spec_id_key] = pdd_spec_id
                if value_image:
                    sku_image_maps[pdd_spec_id] = value_image

        # 处理SKU信息
        sku_list = []
        for sku_info in sku_infos:
            propPath, sku_quantity, sku_price = [sku_info[key] for key in ["propPath", "sku_quantity", "sku_price"]]
            is_onsale = 1 if sku_quantity else 0
            if item_stock_set == "#MANUAL#":
                sku_quantity = advanced_set["custom_stock"]
            sku_init = dict(is_onsale=is_onsale, weight=1000, limit_quantity=999, quantity=sku_quantity)
            spec_id_list, spec_id_keys = [], propPath.split(";")
            for spec_id_key in spec_id_keys:
                spec_id = spec_id_maps[spec_id_key]
                spec_id_list.append(spec_id)
            price = self._get_process_price(price_set["singly_price"], sku_price)
            multi_price = self._get_process_price(price_set["group_price"], sku_price)
            thumb_url = sku_image_maps.get(spec_id_list[0], main_pics[0])
            sku_init.update(spec_id_list=spec_id_list, thumb_url=thumb_url, price=price, multi_price=multi_price)
            sku_list.append(sku_init)
        pdd_submit.update(sku_list=sku_list)
        return pdd_submit

    def pdd_upload_image_single(self, params):
        image_url, image_width = params
        try:
            online_url = self.pdd_upload_image_feature_api.upload_pdd_goods_image_feature(image_url, image_width)
        except Exception as ex:
            online_url = None
        image_url = image_url.split("_800x800")[0]
        return (image_url, online_url)

    def process_submit_by_upload_images(self, submit_dict, item_source):
        # 上传解析完数据内图片
        keys = ["carousel_gallery", "detail_gallery", "sku_list"]
        main_pics, detail_pics, sku_pics = [submit_dict[key] for key in keys]
        sku_pics = list(map(lambda x: x["thumb_url"], sku_pics))
        main_pics = set(main_pics + sku_pics)
        detail_width = 790 if item_source == "#TIANMAO#" else 750
        detail_params = [(detail_pic, detail_width) for detail_pic in detail_pics]
        # 获取800X800的图片
        main_params = [(main_pic + "_800x800.{0}".format(main_pic.split(".")[-1]), 800) for main_pic in main_pics]
        all_params = main_params + detail_params

        with ThreadPoolExecutor(max_workers=3) as executor:
            image_maps = executor.map(self.pdd_upload_image_single, all_params)

        image_maps = dict(list(filter(lambda x: x[1], image_maps)))
        for key in ["carousel_gallery", "detail_gallery"]:
            process_urls = []
            for image_url in submit_dict[key]:
                if image_url in image_maps:
                    process_urls.append(image_maps[image_url])
            submit_dict[key] = process_urls

        init_thumb_url = submit_dict["carousel_gallery"][0]
        for sku in submit_dict["sku_list"]:
            thumb_url = image_maps.get(sku["thumb_url"], init_thumb_url)
            sku["thumb_url"] = thumb_url
        return submit_dict

    def add_pdd_item(self, item_submit):
        # 提交到拼多多
        return self.pdd_add_item_api.add_pdd_goods(item_submit)

    def get_pdd_goods_commit_status(self, num_iids):
        return self.pdd_get_commit_status_api.get_pdd_goods_commit_status(num_iids)

    def set_pdd_goods_status(self, num_iid, is_onsale):
        return self.pdd_set_goods_status_api.set_pdd_goods_sale_status(num_iid, is_onsale)


if __name__ == "__main__":
    sid, nick, platform, soft_code, source = "888530519", "", "pinduoduo", "kjsh", "test"
    copy_service = CopyService(sid, nick, platform, soft_code, source)
    num_iid = 70923557795
    print(copy_service.get_pdd_goods_commit_status([num_iid]))
    # pdd_prop_names = self._get_pdd_prop_names(propertie_rule, propertie_rules, ref_maps)
    # print(copy_service.pdd_get_commit_status_api.get_pdd_goods_commit_status([70607709402]))
    # item_html = copy_service.get_taobao_item_api(625435033956)
    # print(copy_service.pdd_get_spec_api.get_pdd_goods_spec(8132))
    # item_dict = copy_service.parse_taobao_item_api(item_html)
    # pdd_submit = copy_service.parser_item_to_pdd(item_dict, item_set, price_set, advanced_set)
    # pdd_submit = copy_service.process_submit_by_upload_images(pdd_submit)
    # print(pdd_submit)
    # copy_service.add_pdd_item(pdd_submit)


# h5_item_api = "https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B%22itemNumId%22%3A%22{0}%22%7D"
# h5_desc_api = "https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data=%7B%22id%22%3A%22{0}%22%2C%22type%22%3A%221%22%2C+%22f%22%3A%22%22%7D"
# pc_1688_search_api = "https://search.1688.com/service/marketOfferResultViewService"
# pc_1688_item_api = "https://detail.1688.com/offer/{0}.html"
# pc_1688_video_api = "https://cloud.video.taobao.com/play/u/{0}/p/2/e/6/t/1/{1}.mp4"
# wx_1688_shop_items_api = "https://winport.m.1688.com/winport/asyncView"
# wx_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"


#     def map_api_url_to_id(self, htmls, url_maps):
#         # 把api_url映射成item_id
#         new_htmls = {}
#         for api_url, html in htmls.items():
#             api_id = url_maps[api_url]
#             new_htmls[api_id] = html
#         return new_htmls


#     def get_spider_infos_by_proxy(self, spider_urls, spider_type, source):
#         # 使用HTTP代理获取html
#         spider_infos = ProxyClient.Execute(spider_urls, spider_type, source)
#         return spider_infos

#     def get_alibaba_search_pc_api(self, keyword, sort_key, desc_order, src_page_no, price_start=None, price_end=None):
#         # 1688商品搜索接口设计比较麻烦，一页60个商品需分3批获取
#         # 根据关键字获取商品列表
#         page_no = int(math.ceil(src_page_no / 3))
#         index = src_page_no % 3
#         index = index - 1 if index else 2
#         start_index = index * 20

#         search_dict = dict(
#             keywords=keyword.encode("gb18030"),
#             asyncCount=20,
#             pageSize=60,
#             encode="utf-8",
#             uniqfield="userid",
#             sortType=sort_key,
#             startIndex=start_index,
#             descendOrder=desc_order,
#             beginPage=page_no,
#         )
#         search_dict["async"] = True
#         if price_start:
#             search_dict.update(priceStart=price_start)
#         if price_end:
#             search_dict.update(priceEnd=price_end)

#         search_api = requests.Request("GET", self.pc_1688_search_api, params=search_dict).prepare().url
#         print(search_api)
#         search_html = self.get_spider_infos_by_proxy([search_api], "alibaba_pc_search", self.source)[search_api]
#         return search_html

#     def parse_alibaba_search_pc_html(self, search_html):
#         # 解析阿里巴巴搜索页面 根据关键字获取商品列表
#         item_infos = []
#         search_json = json.loads(search_html)["data"]["data"]
#         offer_list, page_amount = [search_json[key] for key in ["offerList", "pageCount"]]
#         for offer in offer_list:
#             main_img = offer["image"]["imgUrl"]
#             num_iid = offer["id"]
#             title = offer["information"]["simpleSubject"]
#             price = offer["tradePrice"]["offerPrice"]["valueString"]
#             item_info = dict(main_img=main_img, title=title, price=price, num_iid=num_iid)
#             item_infos.append(item_info)
#         return item_infos

#     def get_member_id_by_shop_url(self, shop_url):
#         # 获取店铺的memberId
#         headers = {"user-agent": self.wx_user_agent}
#         params = dict(no_cache="true")
#         response = requests.get(shop_url, params=params, headers=headers, timeout=5, allow_redirects=False)
#         location = response.headers["Location"]
#         parse_dict = furl(location)
#         member_id = parse_dict.args["memberId"]
#         return member_id

#     def get_alibaba_shop_items_wx_api(self, member_id, sort_type, page_no):
#         # 获取店铺的商品列表信息 根据店铺获取商品列表
#         search_dict = dict(
#             memberId=member_id, sortType=sort_type, pageIndex=page_no, style="list", _async_id="offerlist:offers"
#         )
#         search_api = requests.Request("GET", self.wx_1688_shop_items_api, params=search_dict).prepare().url
#         print(search_api)
#         search_html = self.get_spider_infos_by_proxy([search_api], "alibaba_wx_shop_items", self.source)[search_api]
#         return search_html

#     def parse_alibaba_shop_items_wx_html(self, search_html):
#         # 解析阿里巴巴店铺商品页面 根据店铺获取商品列表
#         spider_html = json.loads(search_html)["content"]
#         soup = BeautifulSoup(spider_html, "lxml")
#         item_doms = soup.find_all(attrs={"class": "item item-"})
#         item_infos = []
#         for item_dom in item_doms:
#             item_url = item_dom.select_one("a").attrs["href"]
#             main_pic = item_dom.select_one(".item-image > img").attrs["src"]
#             title = item_dom.select_one(".item-title > div > p").string
#             sale = item_dom.select_one(".item-booked > span").string
#             price = item_dom.select(".item-price > div > div > span")[1].string
#             item_info = dict(item_url=item_url, main_pic=main_pic, title=title, sale=sale, price=price)
#             item_infos.append(item_info)
#         return item_infos

#     def get_alibaba_item_pc_api(self, item_id):
#         # 获取商品的详细信息 发现推广商品跳转后不经过后端检查
#         item_url = self.pc_1688_item_api.format(item_id)
#         click_id = hashlib.md5(str(randint(0, 999999999999)).encode("utf-8")).hexdigest()
#         session_id = hashlib.md5(str(randint(0, 999999999999)).encode("utf-8")).hexdigest()
#         item_dict = dict(clickid=click_id, sessionid=session_id)
#         item_api = requests.Request("GET", item_url, params=item_dict).prepare().url
#         item_html = self.get_spider_infos_by_proxy([item_api], "alibaba_pc_item", self.source)[item_api]
#         return item_html

#     def parse_alibaba_item_pc_html(self, item_html, ops_type):
#         # 解析商品详细信息
#         if ops_type == "video_crawler":
#             video_id, user_id = list(map(int, re.findall(r'"videoId":"(.*?)","userId":"(.*?)"', item_html)[0]))
#             video_url = self.pc_1688_video_api.format(user_id, video_id)
#             item_info = dict(video_url=video_url)
#             return item_info
#         # 基本信息解析
#         soup = BeautifulSoup(item_html, "lxml")
#         title = soup.select_one("#mod-detail-title > h1").string
#         main_doms = soup.select("#dt-tab > .tab-content-container > ul > li")
#         main_pics = list(map(lambda x: x.select_one(".vertical-img > a > img").attrs["src"], main_doms))
#         pre_sku_props = json.loads(re.findall(r"skuProps:(.*)(?=,)", item_html)[0])
#         pre_sku_maps = json.loads(re.findall(r"skuMap:(.*)(?=,)", item_html)[0])
#         price_range = re.findall(r"""price:"(.*)(?=\")""", item_html)[0]
#         item_price = float(price_range.split("-")[1]) * 100
#         # 解析基本属性
#         base_prop_doms = soup.select("#mod-detail-attributes > div > table > tbody > tr")
#         base_props = []
#         for base_prop_dom in base_prop_doms:
#             features = list(map(lambda x: x.string, base_prop_dom.select(".de-feature")))
#             values = list(map(lambda x: x.string, base_prop_dom.select(".de-value")))
#             base_prop = map(lambda x: dict([x]), zip(features, values))
#             base_props.extend(base_prop)
#         # 解析SKU属性 由于阿里巴巴没有pid和vid, 为统一格式使用hash生成
#         sku_props = []
#         for pre_sku_prop in pre_sku_props:
#             prop_name, prop_values = [pre_sku_prop[key] for key in ["prop", "value"]]
#             pid = hashlib.md5(prop_name.encode("utf-8")).hexdigest()
#             values = []
#             for prop_value in prop_values:
#                 value_name = prop_value["name"]
#                 vid = hashlib.md5(value_name.encode("utf-8")).hexdigest()
#                 values.append(dict(vid=vid, name=value_name))
#             sku_props.append(dict(pid=pid, name=prop_name, values=values))
#         # 解析SKU信息 propPath使用hash生成，保存和淘宝数据一致
#         sku_infos = []
#         for prop_name, prop_value in pre_sku_maps.items():
#             prop_path = ":".join(list(map(lambda x: hashlib.md5(x.encode("utf-8")).hexdigest(), prop_name.split("&gt;"))))
#             sku_id, sku_quantity, sku_price = [prop_value[key] for key in ["skuId", "canBookCount", "discountPrice"]]
#             sku_price = float(sku_price) * 100
#             sku_infos.append(dict(skuId=sku_id, propPath=prop_path, sku_quantity=sku_quantity, sku_price=sku_price))
#         # 解析类目信息
#         pre_category_info = json.loads(re.findall(r"""(?<=categoryList":).*(?<=])""", item_html)[0])
#         category_id, category_name = [pre_category_info[-1][key] for key in ["id", "name"]]
#         root_category_id = pre_category_info[-2]["id"]
#         # 解析详情页信息
#         desc_api = soup.find(attrs={"class": "desc-lazyload-container"}).attrs["data-tfs-url"]
#         detail_html = self.get_spider_infos_by_proxy([desc_api], "alibaba_pc_detail", self.source)[desc_api]
#         detail_html = json.loads(re.findall("var offer_details=(.*)(?=;)", detail_html)[0])["content"]
#         # 组合数据返回
#         item_info = dict(
#             base_info=dict(main_pics=main_pics, title=title, detail_html=detail_html),
#             props_info=dict(base_props=base_props, sku_props=sku_props),
#             sale_info=dict(item_price=item_price, sku_infos=sku_infos),
#             category_info=dict(category_id=category_id, category_name=category_name, root_category_id=root_category_id),
#         )
#         return item_info

#     def get_taobao_wx_apis(self, item_ids):
#         # 获取无线淘宝的数据接口
#         item_apis = map(lambda item_id: self.h5_item_api.format(item_id), item_ids)
#         item_maps = {self.h5_item_api.format(item_id): item_id for item_id in item_ids}
#         desc_apis = map(lambda item_id: self.h5_desc_api.format(item_id), item_ids)
#         desc_maps = {self.h5_desc_api.format(item_id): item_id for item_id in item_ids}
#         item_htmls = self.get_spider_infos_by_proxy(item_apis, "taobao_wx_item", self.source)
#         desc_htmls = self.get_spider_infos_by_proxy(desc_apis, "taobao_wx_desc", self.source)
#         item_htmls = self.map_api_url_to_id(item_htmls, item_maps)
#         desc_htmls = self.map_api_url_to_id(desc_htmls, desc_maps)
#         return item_htmls, desc_htmls

#     def parse_taobao_wx_html(self, item_html, desc_html):
#         # 解析淘宝无线HTML 商品信息和详情信息
#         item_json = json.loads(item_html)["data"]
#         desc_json = json.loads(desc_html)["data"]

#         category_name = "发动机总成及部件"
#         detail_html = desc_json["pcDescContent"]
#         keys = ["skuBase", "props", "item", "mockData", "props", "skuBase"]
#         skus, props, item, mock_data, props, sku_base = [item_json[key] for key in keys]
#         # 基本信息解析
#         keys = ["images", "categoryId", "rootCategoryId", "title"]
#         main_pics, category_id, root_category_id, title = [item[key] for key in keys]
#         # 基本属性和销售属性解析
#         base_props = props["groupProps"][0]["基本信息"]
#         sku_prices = json.loads(mock_data)["skuCore"]["sku2info"]
#         sku_props = sku_base["props"]
#         sku_infos = sku_base["skus"]
#         item_price = float(sku_prices["0"]["price"]["priceText"])
#         for sku_info in sku_infos:
#             sku_price = sku_prices[sku_info["skuId"]]
#             sku_quantity = sku_price["quantity"]
#             sku_price = float(sku_price["price"]["priceText"])
#             sku_info.update(sku_quantity=sku_quantity, sku_price=sku_price)
#         # 处理主图缺少前缀
#         main_pics = self.add_http_schema(main_pics)
#         item_info = dict(
#             base_info=dict(main_pics=main_pics, title=title, detail_html=detail_html),
#             props_info=dict(base_props=base_props, sku_props=sku_props),
#             sale_info=dict(item_price=item_price, sku_infos=sku_infos),
#             category_info=dict(category_id=category_id, category_name=category_name, root_category_id=root_category_id),
#         )
#         return item_info

#


# # 测试用例
# def taobao_pdd_test(item_id):
#     copy_obj = CopyService("1", "2", "3", "4", "test")
#     item_htmls, desc_htmls = copy_obj.get_taobao_wx_apis([item_id])
#     item_html = item_htmls[item_id]
#     desc_html = desc_htmls[item_id]
#     item_info = copy_obj.parse_taobao_wx_html(item_html, desc_html)
#     pdd_submit = copy_obj.parser_item_to_pdd(item_info)
#     pdd_submit_str, replace_info = copy_obj.upload_images_by_submit(pdd_submit, "pdd")
#     pdd_submit = copy_obj.replace_submit_images(pdd_submit_str, replace_info)
#     commit_id, goods_id = copy_obj.add_pdd_item(pdd_submit)
#     print("commit_id:{0}, goods_id: {1}".format(commit_id, goods_id))


# def alibaba_search_test(keyword, sort_key, desc_order):
#     copy_obj = CopyService("1", "2", "3", "4", "test")
#     search_html = copy_obj.get_alibaba_search_pc_api(keyword, sort_key, desc_order, 4)
#     copy_obj.parse_alibaba_search_pc_html(search_html)


# def alibaba_shop_items_test(shop_url):
#     copy_obj = CopyService("1", "2", "3", "4", "test")
#     member_id = copy_obj.get_member_id_by_shop_url(shop_url)
#     # tradenumdown,wangpu_score,pricedown
#     search_html = copy_obj.get_alibaba_shop_items_wx_api(member_id, "tradenumdown", 1)
#     item_infos = copy_obj.parse_alibaba_shop_items_wx_html(search_html)
#     print(item_infos)


# def alibaba_item_test(item_id):
#     copy_obj = CopyService("1", "2", "3", "4", "test")
#     item_html = copy_obj.get_alibaba_item_pc_api(item_id)
#     item_infos = copy_obj.parse_alibaba_item_pc_html(item_html, "video_crawler")
#     print(item_infos)


# https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B%22itemNumId%22%3A%22595577886459%22%7D&type=json
# # 解析详情页
# desc_apis = re.findall(r"//(?:dscnew|descnew)\.taobao.com.*?(?=')", spider_html)
# desc_apis = list(map(lambda url: "https:" + url, desc_apis))
# # 解析主图
# soup = BeautifulSoup(spider_html, "lxml")
# main_pics = soup.select("#J_UlThumb > li > div > a > img")
# main_pics = list(map(lambda x: x.attrs["data-src"], main_pics))
# main_pics = self._complete_pic_urls(main_pics)
# # 解析标题
# title = soup.select("#J_Title > .tb-main-title")[0].attrs["data-title"]
# # 解析sku属性

# # # 解析sku属性和图片
# # sku_props = item_soup.select(".J_Prop > dd > ul")
# # sku_infos = []
# # for sku_prop in sku_props:
# #     prop_name = sku_prop.attrs["data-property"]
# #     prop_infos = []
# #     property_infos = sku_prop.select("li")
# #     for property_info in property_infos:
# #         ### 属性值
# #         property_value = property_info.attrs["data-value"]
# #         ### 属性背景图
# #         property_url = property_info.find("a").attrs.get("style", "")
# #         property_urls = re.findall(r"(?<=\().*?(?=\))", property_url)
# #         property_url = cls.__complete_pic_urls(property_urls)[0] if property_urls else ""
# #         ### 属性名称
# #         property_text = property_info.find("span").text
# #         prop_info = dict(prop_value=property_value, prop_url=property_url, prop_text=property_text)
# #         prop_infos.append(prop_info)
# #     prop_value = prop_infos[0]["prop_value"].split(":")[0]
# #     sku_info = dict(prop_name=prop_name, prop_infos=prop_infos, prop_value=prop_value)
# #     sku_infos.append(sku_info)
# # #### 解析sku的价格
# # sku_maps = re.findall(r"skuMap:.*?(?=propertyMemoMap)", item_info, re.DOTALL)
# # sku_maps = json.loads(re.findall(r"\{.*\}", sku_maps[0])[0])
# # #### 解析商品属性
# # attr_infos = []
# # attr_props = item_soup.select(".attributes-list > li")
# # for attr_prop in attr_props:
# #     prop_name = attr_prop.text.split(":")[0].split(" ")[-1]
# #     prop_value = attr_prop.attrs["title"]
# #     attr_info = dict(prop_name=prop_name, prop_value=prop_value)
# #     attr_infos.append(attr_info)
# # item_info = dict(
# #     desc_urls=desc_urls,
# #     main_pics=main_pics,
# #     title=title,
# #     sku_infos=sku_infos,
# #     attr_infos=attr_infos,
# #     sku_maps=sku_maps,
# # )


# item_info = dict(
#     base_info = ,
#
#
#     main_pics=main_pics, , )

# soup = BeautifulSoup(spider_html, "lxml")
# main_pics = soup.select("#J_UlThumb > li > div > a > img")
# main_pics = list(map(lambda x: x.attrs["data-src"], main_pics))
# main_pics = self._complete_pic_urls(main_pics)
# # 解析标题
# def _complete_pic_urls(self, pic_urls, scheme="https:"):
#     new_urls = []
#     for pic_url in pic_urls:
#         pic_url = re.sub(r"_\d*x\d*.*", "", pic_url)
#         new_url = scheme + pic_url
#         new_urls.append(new_url)
#     return new_urls

# def parse_taobao_props(self, spider_html):

#     import pdb

#     pdb.set_trace()
