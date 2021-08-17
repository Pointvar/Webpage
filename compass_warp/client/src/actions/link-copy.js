import { createAsyncAction } from "redux-action-tools";
import { AJAX_GET_SHOP_INFO } from "../constants";
import { ajaxGetShopInfo } from "../apis";

// 获取店铺信息
export const getShopInfo = createAsyncAction(AJAX_GET_SHOP_INFO, (action) => {
  return ajaxGetShopInfo(action);
});
