import axios from "./ajax";

// 获取店铺信息
export const ajaxGetShopInfo = (data) => axios.post("ajax_get_shop_info", data);

// 创建复制任务
export const ajaxCreateCopyTask = (data) => axios.post("ajax_create_copy_task", data);

// 获取复制任务详细信息
export const ajaxGetCopyComplexTasks = (data) => axios.post("ajax_get_copy_complex_tasks", data);

// 获取复制任务详细信息
export const ajaxHideCopyComplexTasks = (data) => axios.post("ajax_hide_copy_complex_tasks", data);

// 获取商家的运费模版
export const ajaxGetLogisticTemplates = (data) => axios.post("ajax_get_logistic_templates", data);

// 获取商家授权类目
export const ajaxGetAuthorizeCats = (data) => axios.post("ajax_get_authorize_cats", data);
