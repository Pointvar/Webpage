import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ajaxCreateCopyTask, ajaxGetCopyComplexTasks } from "@/apis";

// ActionCreators
export const createCopyTask = createAsyncThunk("copy/createCopyTask", async (data) => {
  return await ajaxCreateCopyTask(data);
});

export const getCopyComplexTasks = createAsyncThunk("copy/getCopyComplexTasks", async (data) => {
  return await ajaxGetCopyComplexTasks(data);
});

// 初始化State数据
const initialState = { complex_tasks: [], filter: { str: "", platform: "#ALL#", status: "#ALL#" } };

// 生成切片对象
const copySlice = createSlice({
  name: "copy",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCopyTask.fulfilled, () => {});
    builder.addCase(getCopyComplexTasks.fulfilled, (state, action) => {
      state.complex_tasks = action.payload;
      return state;
    });
  },
});

export const selectComplexTasks = (state) => state.copy.complex_tasks;
export const selectFilter = (state) => state.copy.filter.str;

export default copySlice.reducer;
