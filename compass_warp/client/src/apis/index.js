import axios from "axios";
import { AJAX_GET_SHOP_INFO } from "../constants";
export const ajaxGetShopInfo = (data) => axios.post(AJAX_GET_SHOP_INFO, data);
