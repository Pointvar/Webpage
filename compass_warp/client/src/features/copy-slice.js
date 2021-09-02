import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ajaxCreateCopyTask, ajaxGetCopyComplexTasks, ajaxHideCopyComplexTasks, ajaxGetLogisticTemplates } from "@/apis";

// ActionCreators
export const createCopyTask = createAsyncThunk("copy/createCopyTask", async (data = {}) => {
  return await ajaxCreateCopyTask(data);
});

export const getCopyComplexTasks = createAsyncThunk("copy/getCopyComplexTasks", async (data = {}) => {
  return await ajaxGetCopyComplexTasks(data);
});

export const hideCopyComplexTasks = createAsyncThunk("copy/hideCopyComplexTasks", async (data = {}) => {
  return await ajaxHideCopyComplexTasks(data);
});

export const getLogisticTemplates = createAsyncThunk("copy/getLogisticTemplates", async (data = {}) => {
  return await ajaxGetLogisticTemplates(data);
});
// 初始化State数据
const initialState = {
  complexTasks: [],
  selectedKeys: [],
  filterData: { filterTitle: null, filterId: null, filterPlatform: "#ALL#", filterStatus: "#ALL#" },
  logisticTemplates: [],
};

// 生成切片对象
const copySlice = createSlice({
  name: "copy",
  initialState: initialState,
  reducers: {
    setFilterTitle: (state, action) => {
      state.filterData.filterTitle = action.payload;
    },
    setFilterId: (state, action) => {
      state.filterData.filterId = action.payload;
    },
    setFilterPlatform: (state, action) => {
      state.filterData.filterPlatform = action.payload;
    },
    setfilterStatus: (state, action) => {
      state.filterData.filterStatus = action.payload;
    },
    setFilterData: (state) => {
      state.filterData = initialState.filterData;
    },
    setSelectedKeys: (state, action) => {
      state.selectedKeys = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCopyTask.fulfilled, () => {});
    builder.addCase(getCopyComplexTasks.fulfilled, (state, action) => {
      state.complexTasks = action.payload;
    });
    builder.addCase(hideCopyComplexTasks.fulfilled, (state, action) => {
      state.complexTasks = action.payload;
      state.selectedKeys = [];
    });
    builder.addCase(getLogisticTemplates.fulfilled, (state, action) => {
      state.logisticTemplates = action.payload;
    });
  },
});

export const { setFilterTitle, setFilterId, setFilterPlatform, setfilterStatus, setFilterData, setSelectedKeys } =
  copySlice.actions;
export const selectComplexTasks = (state) => state.copy.complexTasks;
export const selectSelectedKeys = (state) => state.copy.selectedKeys;
export const selectFilterData = (state) => state.copy.filterData;
export const selectlogisticTemplates = (state) => state.logisticTemplates;

export default copySlice.reducer;
