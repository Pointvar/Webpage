import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "@/features/common-slice";
import copyReducer from "@/features/copy-slice";

const store = configureStore({
  reducer: {
    common: commonReducer,
    copy: copyReducer,
  },
});

export default store;
