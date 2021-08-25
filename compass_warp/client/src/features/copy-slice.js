import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ajaxCreateCopyTask } from "@/apis";

// ActionCreators
export const createCopyTask = createAsyncThunk(
  "copy/createCopyTask",
  async () => {
    await ajaxCreateCopyTask();
  }
);

// 初始化State数据
const initialState = {};

// 生成切片对象
const copySlice = createSlice({
  name: "copy",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCopyTask.fulfilled, () => {});
  },
});

export default copySlice.reducer;
