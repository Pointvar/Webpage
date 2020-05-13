if __name__ == "__main__":
    import sys

    sys.path.append("/home/liuqi/zhinanzhen/Commons")
    sys.path.append("/home/liuqi/zhinanzhen/Backends")


from spider_servers.proxy_agent_server.proxy_client import ProxyClient
import re
import json
import math
import hashlib
import requests
from furl import furl
from random import randint
from bs4 import BeautifulSoup
from pdd_models.get_pdd_goods_outer_cat_mapping import GetPddGoodsOuterCatMapping
from pdd_models.get_pdd_goods_spec import GetPddGoodsSpec
from pdd_models.get_pdd_goods_spec_id import GetPddGoodsSpecId
from pdd_models.add_pdd_goods import AddPddGoods
from pdd_models.upload_pdd_goods_image import UploadPddGoodsImage

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


class CopyService:
    h5_item_api = "https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B%22itemNumId%22%3A%22{0}%22%7D&type=json"
    h5_desc_api = "https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data=%7B%22id%22%3A%22{0}%22%2C%22type%22%3A%221%22%2C+%22f%22%3A%22%22%7D"
    pc_1688_search_api = "https://search.1688.com/service/marketOfferResultViewService"
    pc_1688_item_api = "https://detail.1688.com/offer/{0}.html"
    pc_1688_video_api = "https://cloud.video.taobao.com/play/u/{0}/p/2/e/6/t/1/{1}.mp4"
    wx_1688_shop_items_api = "https://winport.m.1688.com/winport/asyncView"
    wx_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"

    def __init__(self, sid, nick, platform, soft_name, source):
        self.sid = sid
        self.nick = nick
        self.platform = platform
        self.soft_name = soft_name
        self.source = source
        self.user_info = dict(sid=sid, nick=nick, platform=platform, soft_name=soft_name)
        self.pdd_cat_map_api = GetPddGoodsOuterCatMapping(self.user_info, self.source)
        self.pdd_get_spec_api = GetPddGoodsSpec(self.user_info, self.source)
        self.pdd_get_spec_id_api = GetPddGoodsSpecId(self.user_info, self.source)
        self.pdd_add_item = AddPddGoods(self.user_info, self.source)
        self.pdd_upload_image = UploadPddGoodsImage(self.user_info, self.source)

    def map_api_url_to_id(self, htmls, url_maps):
        # 把api_url映射成item_id
        new_htmls = {}
        for api_url, html in htmls.items():
            api_id = url_maps[api_url]
            new_htmls[api_id] = html
        return new_htmls

    def map_list_to_dict(self, datas, map_info):
        # 把list映射成dict
        key, value = map_info
        new_dict = {data[key]: data[value] for data in datas}
        return new_dict

    def add_http_schema(self, image_urls):
        # 补全图片url
        image_urls = list(map(lambda x: "https:" + x, image_urls))
        return image_urls

    def upload_images_by_submit(self, submit, submit_type):
        # 上传解析完数据内图片
        replace_info = {}
        submit_str = json.dumps(submit)
        image_urls = set(re.findall(r'https://img.alicdn.com/.*?(?=")', submit_str))
        for image_url in image_urls:
            online_url = self.pdd_upload_image.upload_pdd_goods_image(image_url)
            replace_info[image_url] = online_url
        return submit_str, replace_info

    def replace_submit_images(self, submit_str, replace_info):
        # 替换解析后图片数据
        for replace_key, replace_value in replace_info.items():
            submit_str = submit_str.replace(replace_key, replace_value)
        submit = json.loads(submit_str)
        return submit

    def get_spider_infos_by_proxy(self, spider_urls, spider_type, source):
        # 使用HTTP代理获取html
        spider_infos = ProxyClient.Execute(spider_urls, spider_type, source)
        return spider_infos

    def get_alibaba_search_pc_api(self, keyword, sort_key, desc_order, src_page_no, price_start=None, price_end=None):
        # 1688商品搜索接口设计比价麻烦 一页60个商品需分3批获取 根据关键字获取商品列表
        page_no = int(math.ceil(src_page_no / 3))
        index = src_page_no % 3
        index = index - 1 if index else 2
        start_index = index * 20

        search_dict = dict(
            keywords=keyword.encode("gb18030"),
            asyncCount=20,
            pageSize=60,
            encode="utf-8",
            uniqfield="userid",
            sortType=sort_key,
            startIndex=start_index,
            descendOrder=desc_order,
            beginPage=page_no,
        )
        search_dict["async"] = True
        if price_start:
            search_dict.update(priceStart=price_start)
        if price_end:
            search_dict.update(priceEnd=price_end)

        search_api = requests.Request("GET", self.pc_1688_search_api, params=search_dict).prepare().url
        print(search_api)
        search_html = self.get_spider_infos_by_proxy([search_api], "alibaba_pc_search", self.source)[search_api]
        return search_html

    def parse_alibaba_search_pc_html(self, search_html):
        # 解析阿里巴巴搜索页面 根据关键字获取商品列表
        item_infos = []
        search_json = json.loads(search_html)["data"]["data"]
        offer_list, page_amount = [search_json[key] for key in ["offerList", "pageCount"]]
        for offer in offer_list:
            main_img = offer["image"]["imgUrl"]
            num_iid = offer["id"]
            title = offer["information"]["simpleSubject"]
            price = offer["tradePrice"]["offerPrice"]["valueString"]
            item_info = dict(main_img=main_img, title=title, price=price, num_iid=num_iid)
            item_infos.append(item_info)
        return item_infos

    def get_member_id_by_shop_url(self, shop_url):
        # 获取店铺的memberId
        headers = {"user-agent": self.wx_user_agent}
        params = dict(no_cache="true")
        response = requests.get(shop_url, params=params, headers=headers, timeout=5, allow_redirects=False)
        location = response.headers["Location"]
        parse_dict = furl(location)
        member_id = parse_dict.args["memberId"]
        return member_id

    def get_alibaba_shop_items_wx_api(self, member_id, sort_type, page_no):
        # 获取店铺的商品列表信息 根据店铺获取商品列表
        search_dict = dict(
            memberId=member_id, sortType=sort_type, pageIndex=page_no, style="list", _async_id="offerlist:offers"
        )
        search_api = requests.Request("GET", self.wx_1688_shop_items_api, params=search_dict).prepare().url
        print(search_api)
        search_html = self.get_spider_infos_by_proxy([search_api], "alibaba_wx_shop_items", self.source)[search_api]
        return search_html

    def parse_alibaba_shop_items_wx_html(self, search_html):
        # 解析阿里巴巴店铺商品页面 根据店铺获取商品列表
        spider_html = json.loads(search_html)["content"]
        soup = BeautifulSoup(spider_html, "lxml")
        item_doms = soup.find_all(attrs={"class": "item item-"})
        item_infos = []
        for item_dom in item_doms:
            item_url = item_dom.select_one("a").attrs["href"]
            main_pic = item_dom.select_one(".item-image > img").attrs["src"]
            title = item_dom.select_one(".item-title > div > p").string
            sale = item_dom.select_one(".item-booked > span").string
            price = item_dom.select(".item-price > div > div > span")[1].string
            item_info = dict(item_url=item_url, main_pic=main_pic, title=title, sale=sale, price=price)
            item_infos.append(item_info)
        return item_infos

    def get_alibaba_item_pc_api(self, item_id):
        # 获取商品的详细信息 发现推广商品跳转后不需要经过后端检查
        item_url = self.pc_1688_item_api.format(item_id)
        click_id = hashlib.md5(str(randint(0, 999999999999)).encode("utf-8")).hexdigest()
        session_id = hashlib.md5(str(randint(0, 999999999999)).encode("utf-8")).hexdigest()
        item_dict = dict(clickid=click_id, sessionid=session_id)
        item_api = requests.Request("GET", item_url, params=item_dict).prepare().url
        print(item_api)
        item_html = self.get_spider_infos_by_proxy([item_api], "alibaba_pc_item", self.source)[item_api]
        return item_html

    def parse_alibaba_item_pc_html(self, item_html, ops_type):
        # 解析商品详细信息
        if ops_type == "video_crawler":
            video_id, user_id = list(map(int, re.findall(r'"videoId":"(.*?)","userId":"(.*?)"', item_html)[0]))
            video_url = self.pc_1688_video_api.format(user_id, video_id)
            item_info = dict(video_url=video_url)
            return item_info
        # 基本信息解析
        soup = BeautifulSoup(item_html, "lxml")
        title = soup.select_one("#mod-detail-title > h1").string
        main_doms = soup.select("#dt-tab > .tab-content-container > ul > li")
        main_pics = list(map(lambda x: x.select_one(".vertical-img > a > img").attrs["src"], main_doms))
        pre_sku_props = json.loads(re.findall(r"skuProps:(.*)(?=,)", item_html)[0])
        pre_sku_maps = json.loads(re.findall(r"skuMap:(.*)(?=,)", item_html)[0])
        price_range = re.findall(r"""price:"(.*)(?=\")""", item_html)[0]
        item_price = float(price_range.split("-")[1]) * 100
        # 解析基本属性
        base_prop_doms = soup.select("#mod-detail-attributes > div > table > tbody > tr")
        base_props = []
        for base_prop_dom in base_prop_doms:
            features = list(map(lambda x: x.string, base_prop_dom.select(".de-feature")))
            values = list(map(lambda x: x.string, base_prop_dom.select(".de-value")))
            base_prop = map(lambda x: dict([x]), zip(features, values))
            base_props.extend(base_prop)
        # 解析SKU属性 由于阿里巴巴没有pid和vid, 统一格式使用hash生成
        sku_props = []
        for pre_sku_prop in pre_sku_props:
            prop_name, prop_values = [pre_sku_prop[key] for key in ["prop", "value"]]
            pid = hashlib.md5(prop_name.encode("utf-8")).hexdigest()
            values = []
            for prop_value in prop_values:
                value_name = prop_value["name"]
                vid = hashlib.md5(value_name.encode("utf-8")).hexdigest()
                values.append(dict(vid=vid, name=value_name))
            sku_props.append(dict(pid=pid, name=prop_name, values=values))
        # 解析SKU信息 propPath使用hash生成，保存和淘宝数据一致
        sku_infos = []
        for prop_name, prop_value in pre_sku_maps.items():
            prop_path = ":".join(
                list(map(lambda x: hashlib.md5(x.encode("utf-8")).hexdigest(), prop_name.split("&gt;")))
            )
            sku_id, sku_quantity, sku_price = [prop_value[key] for key in ["skuId", "canBookCount", "discountPrice"]]
            sku_price = float(sku_price) * 100
            sku_infos.append(dict(skuId=sku_id, propPath=prop_path, sku_quantity=sku_quantity, sku_price=sku_price))
        # 解析类目信息
        pre_category_info = json.loads(re.findall(r"""(?<=categoryList":).*(?<=])""", item_html)[0])
        category_id, category_name = [pre_category_info[-1][key] for key in ["id", "name"]]
        root_category_id = pre_category_info[-2]["id"]
        # 解析详情页信息
        desc_api = soup.find(attrs={"class": "desc-lazyload-container"}).attrs["data-tfs-url"]
        detail_html = self.get_spider_infos_by_proxy([desc_api], "alibaba_pc_detail", self.source)[desc_api]
        detail_html = json.loads(re.findall("var offer_details=(.*)(?=;)", detail_html)[0])["content"]
        # 组合数据返回
        item_info = dict(
            base_info=dict(main_pics=main_pics, title=title, detail_html=detail_html),
            props_info=dict(base_props=base_props, sku_props=sku_props),
            sale_info=dict(item_price=item_price, sku_infos=sku_infos),
            category_info=dict(category_id=category_id, category_name=category_name, root_category_id=root_category_id),
        )
        return item_info

    def get_taobao_wx_apis(self, item_ids):
        # 获取无线淘宝的数据接口
        item_apis = map(lambda item_id: self.h5_item_api.format(item_id), item_ids)
        item_maps = {self.h5_item_api.format(item_id): item_id for item_id in item_ids}
        desc_apis = map(lambda item_id: self.h5_desc_api.format(item_id), item_ids)
        desc_maps = {self.h5_desc_api.format(item_id): item_id for item_id in item_ids}
        item_htmls = self.get_spider_infos_by_proxy(item_apis, "taobao_wx_item", self.source)
        desc_htmls = self.get_spider_infos_by_proxy(desc_apis, "taobao_wx_desc", self.source)
        item_htmls = self.map_api_url_to_id(item_htmls, item_maps)
        desc_htmls = self.map_api_url_to_id(desc_htmls, desc_maps)
        return item_htmls, desc_htmls

    def parse_taobao_wx_html(self, item_html, desc_html):
        # 解析淘宝无线HTML 商品信息和详情信息
        item_json = json.loads(item_html)["data"]
        desc_json = json.loads(desc_html)["data"]

        category_name = "发动机总成及部件"
        detail_html = desc_json["pcDescContent"]
        keys = ["skuBase", "props", "item", "mockData", "props", "skuBase"]
        skus, props, item, mock_data, props, sku_base = [item_json[key] for key in keys]
        # 基本信息解析
        keys = ["images", "categoryId", "rootCategoryId", "title"]
        main_pics, category_id, root_category_id, title = [item[key] for key in keys]
        # 基本属性和销售属性解析
        base_props = props["groupProps"][0]["基本信息"]
        sku_prices = json.loads(mock_data)["skuCore"]["sku2info"]
        sku_props = sku_base["props"]
        sku_infos = sku_base["skus"]
        item_price = float(sku_prices["0"]["price"]["priceText"])
        for sku_info in sku_infos:
            sku_price = sku_prices[sku_info["skuId"]]
            sku_quantity = sku_price["quantity"]
            sku_price = float(sku_price["price"]["priceText"])
            sku_info.update(sku_quantity=sku_quantity, sku_price=sku_price)
        # 处理主图缺少前缀
        main_pics = self.add_http_schema(main_pics)
        item_info = dict(
            base_info=dict(main_pics=main_pics, title=title, detail_html=detail_html),
            props_info=dict(base_props=base_props, sku_props=sku_props),
            sale_info=dict(item_price=item_price, sku_infos=sku_infos),
            category_info=dict(category_id=category_id, category_name=category_name, root_category_id=root_category_id),
        )
        return item_info

    def parser_item_to_pdd(self, item_info):
        # 转换商品信息为拼多多提交数据
        # 提交信息初始化
        pdd_submit = dict(
            cost_template_id=3442958,
            customer_num=2,
            is_folt=True,
            goods_type=1,
            country_id=0,
            second_hand=False,
            shipment_limit_second=172800,
            delivery_one_day=0,
            is_pre_sale=False,
            is_refundable=True,
        )
        # 基本信息提取
        keys = ["base_info", "props_info", "sale_info", "category_info"]
        base_info, props_info, sale_info, category_info = [item_info[key] for key in keys]
        main_pics, title = [base_info[key] for key in ["main_pics", "title"]]
        base_props, sku_props = [props_info[key] for key in ["base_props", "sku_props"]]
        category_id, category_name = [category_info[key] for key in ["category_id", "category_name"]]
        item_price, sku_infos = [sale_info[key] for key in ["item_price", "sku_infos"]]
        item_price = int(item_price)
        # 商品类目关系映射 拼多多提供的API
        category_info = self.pdd_cat_map_api.get_pdd_goods_outer_cat_mapping(category_id, category_name, title)
        category_id = category_info[-1]
        # 更新提交信息
        pdd_submit.update(
            cat_id=category_id,
            carousel_gallery=main_pics,
            detail_gallery=main_pics,
            goods_desc=title,
            goods_name=title,
            market_price=item_price + 1000,
        )
        # 处理销售属性
        sku_maps = {"颜色分类": "颜色"}
        pdd_skus = self.pdd_get_spec_api.get_pdd_goods_spec(category_id)
        pdd_skus = self.map_list_to_dict(pdd_skus, ["parent_spec_name", "parent_spec_id"])

        spec_id_maps = {}
        for sku_prop in sku_props:
            sku_prop_id, sku_old_name, sku_prop_values = [sku_prop[key] for key in ["pid", "name", "values"]]
            sku_new_name = sku_maps.get(sku_old_name, "颜色")
            parent_spec_id = pdd_skus[sku_new_name]

            for sku_prop_value in sku_prop_values:
                value_id = sku_prop_value["vid"]
                value_name = sku_prop_value["name"]
                spec_id = self.pdd_get_spec_id_api.get_pdd_goods_spec_id(parent_spec_id, value_name)
                spec_id_key = ":".join(map(str, [sku_prop_id, value_id]))
                spec_id_maps[spec_id_key] = spec_id
        # 处理SKU信息
        sku_list = []
        for sku_info in sku_infos:
            sku_init = dict(is_onsale=1, weight=1000, limit_quantity=999, quantity=0)
            propPath, sku_quantity, sku_price = [sku_info[key] for key in ["propPath", "sku_quantity", "sku_price"]]
            spec_id_list, spec_id_keys = [], propPath.split(";")
            for spec_id_key in spec_id_keys:
                spec_id = spec_id_maps[spec_id_key]
                spec_id_list.append(spec_id)
            sku_init.update(
                spec_id_list=spec_id_list, thumb_url=main_pics[0], price=item_price, multi_price=item_price - 1000
            )
            sku_list.append(sku_init)
        pdd_submit.update(sku_list=sku_list)
        return pdd_submit

    def add_pdd_item(self, item_submit):
        # 提交到拼多多
        return self.pdd_add_item.add_pdd_goods(item_submit)


# 测试用例
def taobao_pdd_test(item_id):
    copy_obj = CopyService("1", "2", "3", "4", "test")
    item_htmls, desc_htmls = copy_obj.get_taobao_wx_apis([item_id])
    item_html = item_htmls[item_id]
    desc_html = desc_htmls[item_id]
    item_info = copy_obj.parse_taobao_wx_html(item_html, desc_html)
    pdd_submit = copy_obj.parser_item_to_pdd(item_info)
    pdd_submit_str, replace_info = copy_obj.upload_images_by_submit(pdd_submit, "pdd")
    pdd_submit = copy_obj.replace_submit_images(pdd_submit_str, replace_info)
    commit_id, goods_id = copy_obj.add_pdd_item(pdd_submit)
    print("commit_id:{0}, goods_id: {1}".format(commit_id, goods_id))


def alibaba_search_test(keyword, sort_key, desc_order):
    copy_obj = CopyService("1", "2", "3", "4", "test")
    search_html = copy_obj.get_alibaba_search_pc_api(keyword, sort_key, desc_order, 4)
    copy_obj.parse_alibaba_search_pc_html(search_html)


def alibaba_shop_items_test(shop_url):
    copy_obj = CopyService("1", "2", "3", "4", "test")
    member_id = copy_obj.get_member_id_by_shop_url(shop_url)
    # tradenumdown,wangpu_score,pricedown
    search_html = copy_obj.get_alibaba_shop_items_wx_api(member_id, "tradenumdown", 1)
    item_infos = copy_obj.parse_alibaba_shop_items_wx_html(search_html)
    print(item_infos)


def alibaba_item_test(item_id):
    copy_obj = CopyService("1", "2", "3", "4", "test")
    item_html = copy_obj.get_alibaba_item_pc_api(item_id)
    item_infos = copy_obj.parse_alibaba_item_pc_html(item_html, "video_crawler")
    print(item_infos)


if __name__ == "__main__":
    # taobao_pdd_test(595183899574)
    # alibaba_search_test("法式复古连衣裙夏", "va_rmdarkgmv30rt", True)
    # alibaba_shop_items_test("https://qiyilianmd.1688.com/")
    alibaba_item_test(592225001643)
