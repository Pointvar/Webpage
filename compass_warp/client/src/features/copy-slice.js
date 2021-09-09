import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ajaxCreateCopyTask,
  ajaxGetCopyComplexTasks,
  ajaxHideCopyComplexTasks,
  ajaxGetLogisticTemplates,
  ajaxGetAuthorizeCats,
} from "@/apis";

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

export const getAuthorizeCats = createAsyncThunk("copy/getAuthorizeCats", async (data = {}) => {
  return await ajaxGetAuthorizeCats(data);
});

// 初始化State数据
const initialState = {
  complexTasks: [],
  selectedKeys: [],
  filterData: { filterTitle: null, filterId: null, filterPlatform: "#ALL#", filterStatus: "#ALL#" },
  logisticTemplates: [],
  authorizeCats: [],
  loopTimes: 0,
  currentPageDatas: [],
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
    setLoopTimes: (state, action) => {
      state.loopTimes = action.payload;
    },
    setCurrentPageDatas: (state, action) => {
      state.currentPageDatas = action.payload;
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
      state.logisticTemplates = action.payload.map((logisticTemplate) => {
        const { template_id, template_name } = logisticTemplate;
        return { key: template_id, value: template_name };
      });
    });
    builder.addCase(getAuthorizeCats.fulfilled, (state, action) => {
      state.authorizeCats = action.payload;
    });
  },
});

export const {
  setFilterTitle,
  setFilterId,
  setFilterPlatform,
  setfilterStatus,
  setFilterData,
  setSelectedKeys,
  setLoopTimes,
  setCurrentPageDatas,
} = copySlice.actions;
export const selectComplexTasks = (state) => state.copy.complexTasks;
export const selectSelectedKeys = (state) => state.copy.selectedKeys;
export const selectFilterData = (state) => state.copy.filterData;
export const selectlogisticTemplates = (state) => state.copy.logisticTemplates;
export const selectAuthorizeCats = (state) => state.copy.authorizeCats;
export const selectLoopTimes = (state) => state.copy.loopTimes;
export const selectCurrentPageDatas = (state) => state.copy.currentPageDatas;

export default copySlice.reducer;
