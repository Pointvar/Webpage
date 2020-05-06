import sys

sys.path.append("/home/liuqi/Commons")
from pdd_models.get_pdd_goods_cats import GetPddGoodsCats
from pdd_models.get_pdd_goods_cat_template import GetPddGoodsCatTemplate

from category_infos.pdd_props_db import PddPropsDB
from category_infos.pdd_category_db import PddCategoryDB

import logging

logger = logging.getLogger(__name__)


def main():
    user_info = dict(sid="1", nick="2", platform="3", soft_name="4")
    pdd_cats_api = GetPddGoodsCats(user_info, "test")
    pdd_props_api = GetPddGoodsCatTemplate(user_info, "test")
    pdd_cat_db = PddCategoryDB(100000, "ops", "ops", "ops")
    pdd_props_db = PddPropsDB(100000, "ops", "ops", "ops")

    # cat_infos = pdd_cats_api.get_pdd_goods_cats(0)
    # keys = ["level", "cat_name", "cat_id", "parent_cat_id"]
    # while cat_infos:
    #     cat_info = cat_infos.pop()
    #     level, cat_name, cat_id, parent_cat_id = [cat_info[key] for key in keys]
    #     child_cats = pdd_cats_api.get_pdd_goods_cats(cat_id)
    #     is_parent = True if child_cats else False
    #     pdd_cat_db.insert_pdd_category(cat_id, cat_name, level, parent_cat_id, is_parent)
    #     cat_infos.extend(child_cats)
    last_cats = pdd_cat_db.get_last_pdd_categorys()
    for last_cat in last_cats:
        cat_id = last_cat["cat_id"]
        import pdb

        pdb.set_trace()
        props_info = pdd_props_api.get_pdd_goods_cat_template(cat_id)
        keys = [
            "id",
            "input_max_spec_num",
            "max_sku_num",
            "single_spec_value_num",
            "choose_all_qualify_spec",
            "properties",
        ]
        prop_id, max_spec_num, max_sku_num, single_spec_num, all_spec, properties = [props_info[key] for key in keys]
        pdd_props_db.insert_pdd_props(cat_id, prop_id, max_spec_num, max_sku_num, single_spec_num, all_spec, properties)


if __name__ == "__main__":
    main()
