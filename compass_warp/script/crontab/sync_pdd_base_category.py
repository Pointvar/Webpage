if __name__ == "__main__":
    import os
    import sys

    sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
    print (os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
    from compass_warp.compass_conf.set_env import set_path_env

    set_path_env()

from pdd_models.get_pdd_goods_cats import GetPddGoodsCats
from pdd_models.get_pdd_goods_cat_template import GetPddGoodsCatTemplate

from category_infos.pdd_props_db import PddPropsDB
from category_infos.pdd_category_db import PddCategoryDB

import logging

logger = logging.getLogger(__name__)


def process_main():
    user_info = dict(sid="", nick="", platform="", soft_name="sxsh")
    pdd_cats_api = GetPddGoodsCats(user_info, "sync_script")
    pdd_props_api = GetPddGoodsCatTemplate(user_info, "sync_script")
    pdd_cat_db = PddCategoryDB("", "", "", "")
    pdd_props_db = PddPropsDB("", "", "", "")

    cat_infos = pdd_cats_api.get_pdd_goods_cats(0)
    keys = ["level", "cat_name", "cat_id", "parent_cat_id"]
    while cat_infos:
        cat_info = cat_infos.pop()
        level, cat_name, cat_id, parent_cat_id = [cat_info[key] for key in keys]
        child_cats = pdd_cats_api.get_pdd_goods_cats(cat_id)
        print(cat_id)
        is_parent = True if child_cats else False
        # pdd_cat_db.insert_pdd_category(cat_id, cat_name, level, parent_cat_id, is_parent)
        cat_infos.extend(child_cats)
        print(len(cat_infos))
    # last_cats = pdd_cat_db.get_last_pdd_categorys()
    # for last_cat in last_cats:
    #     cat_id = last_cat["cat_id"]
    #     import pdb

    #     pdb.set_trace()
    #     props_info = pdd_props_api.get_pdd_goods_cat_template(cat_id)
    #     keys = ["id", "input_max_spec_num", "max_sku_num", "single_spec_value_num", "choose_all_qualify_spec", "properties"]
    #     prop_id, max_spec_num, max_sku_num, single_spec_num, all_spec, properties = [props_info[key] for key in keys]
    #     pdd_props_db.insert_pdd_props(cat_id, prop_id, max_spec_num, max_sku_num, single_spec_num, all_spec, properties)


if __name__ == "__main__":
    process_main()
