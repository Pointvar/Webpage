import { createReducer } from "redux-action-tools";
import { AJAX_GET_SHOP_INFO } from "../constants";

const linkCopyReducer = createReducer()
  .when(AJAX_GET_SHOP_INFO)
  .done((state, action) => {
    return { ...state, shop_info: action.payload.data.data };
  })
  .build({ shop_info: { nick: "xxx", deadline: "2020-01-09" } });

export default linkCopyReducer;
