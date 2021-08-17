import { createReducer } from "redux-action-tools";
import { AJAX_GET_SHOP_INFO } from "../constants";

const linkCopyReducer = createReducer()
  .when(AJAX_GET_SHOP_INFO)
  .done((state, action) => {
    return { ...state, data: action.payload.data.data };
  })
  .build({ data: { nick: "xxx", deadline: "2020-01-09" } });

export default linkCopyReducer;
