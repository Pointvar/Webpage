import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";

import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/store";

import { Layout, ConfigProvider, Table } from "antd";
const { Content } = Layout;
import zhCN from "antd/lib/locale/zh_CN";

import PageHeader from "@/components/page-header";
import TableArea from "@/components/table_area";
import PageFooter from "@/components/page-footer";

import { NAV_MENUS } from "@/constants/common";
import { getCopyComplexTasks, hideCopyComplexTasks } from "@/features/copy-slice";
import { getShopInfo } from "@/features/common-slice";
import {
  selectComplexTasks,
  selectFilterData,
  selectSelectedKeys,
  setFilterTitle,
  setFilterId,
  setFilterPlatform,
  setfilterStatus,
  setFilterData,
  setSelectedKeys,
} from "@/features/copy-slice";
import { includes, isEqual, reduce } from "lodash";
// import { ajaxCreateCopyTask } from "@/apis";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  menus: NAV_MENUS,
  activeLink: "copy_record",
};

const statusMaps = [
  { key: "#ALL#", value: "全部" },
  { key: "#WAIT#", value: "等待中" },
  { key: "#PROCESS#", value: "处理中" },
  { key: "#FINISH#", value: "任务完成" },
  { key: "#FAIL#", value: "任务失败" },
];

const columnsStatusMaps = reduce(
  statusMaps,
  (object, dict) => {
    object[dict.key] = dict.value;
    return object;
  },
  {}
);

const platformMaps = [
  { key: "#ALL#", value: "全部" },
  { key: "taobao", value: "淘宝" },
  { key: "tianmao", value: "天猫" },
];

const columns = [
  {
    title: "商品标题",
    dataIndex: "copy_url",
  },
  {
    title: "复制时间",
    dataIndex: "c_time",
  },
  {
    title: "复制状态",
    dataIndex: "status",
    render: (text) => {
      return columnsStatusMaps[text];
    },
  },
];

// 我的记录页面主体
function CopyRecord() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCopyComplexTasks({}));
    dispatch(getShopInfo({}));
  }, []);

  let complexTasks = useSelector(selectComplexTasks);

  const filterData = useSelector(selectFilterData);
  const { filterTitle, filterId, filterPlatform, filterStatus } = filterData;
  if (filterTitle) {
    complexTasks = complexTasks.filter((element) => {
      return includes(element.copy_url, filterTitle);
    });
  }
  if (filterId) {
    complexTasks = complexTasks.filter((element) => {
      return isEqual(element.src_num_iid, filterId) || isEqual(element.dst_num_iid, filterId);
    });
  }
  if (filterPlatform !== "#ALL#") {
    complexTasks = complexTasks.filter((element) => {
      return isEqual(element.source, filterPlatform);
    });
  }

  if (filterStatus !== "#ALL#") {
    complexTasks = complexTasks.filter((element) => {
      return isEqual(element.status, filterStatus);
    });
  }
  // 表格操作区域
  const onSearchTitle = (title) => {
    dispatch(setFilterTitle(title));
  };
  const onSearchId = (id) => {
    dispatch(setFilterId(id));
  };
  const onSearchPlatform = (platform) => {
    dispatch(setFilterPlatform(platform));
  };
  const onSearchStatus = (status) => {
    dispatch(setfilterStatus(status));
  };
  const onClickRestSearch = () => {
    dispatch(setFilterData());
  };

  const onClickHideTasks = () => {
    dispatch(hideCopyComplexTasks({ in_ids: selectedKeys }));
  };
  // 表格选中项
  const selectedKeys = useSelector(selectSelectedKeys);
  const onSelectChange = (select_keys) => {
    dispatch(setSelectedKeys(select_keys));
  };
  const rowSelection = {
    selectedKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };

  return (
    <Fragment>
      <PageHeader {...headerProps} />
      <Content>
        <TableArea
          columns={columns}
          dataSource={complexTasks}
          rowSelection={rowSelection}
          statusMaps={statusMaps}
          platformMaps={platformMaps}
          selectedKeys={selectedKeys}
          onSearchTitle={onSearchTitle}
          onSearchId={onSearchId}
          onSearchPlatform={onSearchPlatform}
          onSearchStatus={onSearchStatus}
          onClickRestSearch={onClickRestSearch}
          onClickHideTasks={onClickHideTasks}
        />
      </Content>
      <PageFooter />
    </Fragment>
  );
}

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <CopyRecord />
    </Provider>
  </ConfigProvider>,
  document.getElementById("root")
);
