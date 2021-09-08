import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";

import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/store";

import { Layout, ConfigProvider, Table, Progress, Button, Popover, Form } from "antd";
const { Content } = Layout;
import zhCN from "antd/lib/locale/zh_CN";

import PageHeader from "@/components/page-header";
import TableHeader from "@/components/table-header";
import TableArea from "@/components/table-area";
import PageFooter from "@/components/page-footer";

import { NAV_MENUS } from "@/constants/common";
import { getCopyComplexTasks, hideCopyComplexTasks } from "@/features/copy-slice";
import { getShopInfo, selectShopInfo } from "@/features/common-slice";
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

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  NavMenus: NAV_MENUS,
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

const checkMaps = [
  { key: "#WAIT#", value: "等待中" },
  { key: "#PROCESS#", value: "审核中" },
  { key: "#FINISH#", value: "审核通过" },
  { key: "#FAIL#", value: "审核驳回" },
];

const checkStatusMaps = reduce(
  checkMaps,
  (object, dict) => {
    object[dict.key] = dict.value;
    return object;
  },
  {}
);

const platformMaps = [
  { key: "#ALL#", value: "全部" },
  { key: "#TAOBAO#", value: "淘宝" },
  { key: "#TIANMAO#", value: "天猫" },
];

const platformStatusMaps = reduce(
  platformMaps,
  (object, dict) => {
    object[dict.key] = dict.value;
    return object;
  },
  {}
);

const statusProgress = (text, row) => {
  const formatStatus = columnsStatusMaps[text];
  let percent = 0,
    status = "normal",
    color = "rgb(0, 0, 0)";
  if (text === "#PROCESS#") {
    percent = row.process_step;
    color = "rgb(24, 144, 255)";
  } else if (text === "#FINISH#") {
    percent = 100;
    status = "success";
    color = "rgb(82, 195, 27)";
  } else if (text === "#FAIL#") {
    percent = 100;
    status = "exception";
    color = "rgb(255, 77, 78)";
  }
  const fragment = (
    <Fragment>
      <Progress type="circle" percent={percent} status={status} width={40} />
      <div className="x" style={{ color }}>
        {formatStatus}
      </div>
    </Fragment>
  );
  return fragment;
};

const checkStatusProgress = (text, row) => {
  const formatStatus = checkStatusMaps[text];
  let percent = 0,
    status = "normal",
    color = "rgb(0, 0, 0)",
    content;
  if (text === "#PROCESS#") {
    percent = 50;
    color = "rgb(24, 144, 255)";
  } else if (text === "#FINISH#") {
    percent = 100;
    status = "success";
    color = "rgb(82, 195, 27)";
  } else if (text === "#FAIL#") {
    percent = 100;
    status = "exception";
    color = "rgb(255, 77, 78)";
    content = (
      <span>
        驳回原因: {row.check_fail_msg}
        <hr /> <strong>点击右侧编辑商品按钮编辑后提交。</strong>
      </span>
    );
  }
  const fragment = content ? (
    <Popover placement="top" content={content} trigger="hover">
      <Progress type="circle" percent={percent} status={status} width={40} />
      <div style={{ color }}>{formatStatus}</div>
    </Popover>
  ) : (
    <Fragment>
      <Progress type="circle" percent={percent} status={status} width={40} />
      <div style={{ color }}>{formatStatus}</div>
    </Fragment>
  );
  return fragment;
};

const columns = [
  {
    title: "源商品信息",
    dataIndex: "src_item",
    width: 400,
    align: "center",
    className: "src-item-info",
    ellipsis: true,
    render: (text, row) => {
      let fragment;
      if (row.main_pic && row.itme_title) {
        fragment = (
          <Fragment>
            <img src={`${row.main_pic}_60x60q90.jpg`} />
            <a href={row.copy_url} target="_blank" rel="noreferrer">
              <span>{row.itme_title}</span>
            </a>
          </Fragment>
        );
      } else {
        fragment = <a href={row.copy_url}>{row.parsed_url}</a>;
      }
      return fragment;
    },
  },
  {
    title: "源商品ID",
    dataIndex: "src_num_iid",
    align: "center",
  },
  {
    title: "来源",
    dataIndex: "source",
    align: "center",
    render: (text) => {
      return platformStatusMaps[text];
    },
  },
  {
    title: "上货时间",
    dataIndex: "c_time",
    align: "center",
  },
  {
    title: "商品ID",
    dataIndex: "dst_num_iid",
    align: "center",
  },
  {
    title: "上货状态",
    dataIndex: "status",
    align: "center",
    render: statusProgress,
  },
  {
    title: "审核状态",
    dataIndex: "check_status",
    align: "center",
    render: checkStatusProgress,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    render: (text, row) => {
      let editUrl;
      if (row.dst_num_iid) {
        if (row.check_status === "#FINISH#") {
          editUrl = `https://mms.pinduoduo.com/goods/goods_list/transfer?id=${row.dst_num_iid}`;
        } else if (row.check_status === "#FAIL#") {
          editUrl = `https://mms.pinduoduo.com/goods/goods_return_detail?id=${row.dst_num_iid}`;
        }
      }

      const disabled = editUrl ? false : true;
      const fragment = (
        <a href={editUrl} target="_blank" rel="noreferrer">
          <Button type="dashed" disabled={disabled}>
            编辑商品
          </Button>
        </a>
      );
      return fragment;
    },
  },
];

// 我的记录页面主体
function CopyRecord() {
  const dispatch = useDispatch();
  let complexTasks = useSelector(selectComplexTasks);
  const shopInfo = useSelector(selectShopInfo);
  useEffect(() => {
    dispatch(getShopInfo({}));
    dispatch(getCopyComplexTasks({}));
  }, []);

  const initialValues = { filterTitle: null, filterId: null, filterPlatform: "#ALL#", filterStatus: "#ALL#" };

  const filterData = useSelector(selectFilterData);
  const { filterTitle, filterId, filterPlatform, filterStatus } = filterData;
  if (filterTitle) {
    complexTasks = complexTasks.filter((element) => {
      return includes(element.itme_title, filterTitle);
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
    form.resetFields();
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
  const [form] = Form.useForm();

  return (
    <Fragment>
      <PageHeader {...headerProps} shopInfo={shopInfo} />
      <Content>
        <TableHeader
          initialValues={initialValues}
          form={form}
          statusMaps={statusMaps}
          platformMaps={platformMaps}
          dataSource={complexTasks}
          selectedKeys={selectedKeys}
          onSearchTitle={onSearchTitle}
          onSearchId={onSearchId}
          onSearchPlatform={onSearchPlatform}
          onSearchStatus={onSearchStatus}
          onClickRestSearch={onClickRestSearch}
          onClickHideTasks={onClickHideTasks}
        />
        <TableArea columns={columns} dataSource={complexTasks} rowSelection={rowSelection} />
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
