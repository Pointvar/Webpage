import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ajaxGetShopInfo } from "@/apis";

// ActionCreators
export const getShopInfo = createAsyncThunk("common/getShopInfo", async (data) => {
  const shopInfo = await ajaxGetShopInfo(data);
  return shopInfo;
});

// 初始化State数据
const initialState = { shopInfo: {} };

// 生成切片对象
const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getShopInfo.fulfilled, (state, action) => {
      state.shopInfo = action.payload;
    });
  },
});

export const selectShopInfo = (state) => state.common.shopInfo;

export default commonSlice.reducer;
