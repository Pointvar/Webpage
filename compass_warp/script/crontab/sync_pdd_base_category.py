if __name__ == "__main__":
    import os
    import sys

    sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))
    from compass_warp.compass_conf.set_env import set_path_env

    set_path_env()

from pdd_models.get_pdd_goods_cats import GetPddGoodsCats

from db_models.category_infos.pdd_category_db import PddCategoryDB

import logging

logger = logging.getLogger(__name__)


def process_main():
    sid, nick, platform, soft_code = "888530519", "pdd88853051977", "pinduoduo", "kjsh"
    user_info = dict(sid=sid, nick=nick, platform=platform, soft_code=soft_code)
    pdd_cats_api = GetPddGoodsCats(user_info, "sync_script")
    pdd_cat_db = PddCategoryDB(sid, nick, platform, soft_code)

    cat_infos = pdd_cats_api.get_pdd_goods_cats(0)
    keys = ["level", "cat_name", "cat_id", "parent_cat_id"]
    while cat_infos:
        cat_info = cat_infos.pop()
        level, cat_name, cat_id, parent_cat_id = [cat_info[key] for key in keys]
        child_cats = pdd_cats_api.get_pdd_goods_cats(cat_id) if level < 4 else []
        is_parent = True if child_cats else False
        pdd_cat_db.insert_pdd_category(cat_id, cat_name, level, parent_cat_id, is_parent)
        cat_infos.extend(child_cats)


if __name__ == "__main__":
    process_main()
