import axios from "./ajax";

// 获取店铺信息
export const ajaxGetShopInfo = (data) => axios.post("ajax_get_shop_info", data);

export const ajaxCreateCopyTask = (data) =>
  axios.post("ajax_create_copy_task", data);
