import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";

import { Provider, useDispatch } from "react-redux";
import store from "@/store";

import { Layout, ConfigProvider } from "antd";
const { Content } = Layout;
import zhCN from "antd/lib/locale/zh_CN";

import PageHeader from "@/components/page-header";
import TableArea from "@/components/table_area";
import PageFooter from "@/components/page-footer";

import { NAV_MENUS } from "@/constants/common";
import { getCopyComplexTasks } from "@/features/copy-slice";
import { getShopInfo } from "@/features/common-slice";
// import { ajaxCreateCopyTask } from "@/apis";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  menus: NAV_MENUS,
  activeLink: "copy_record",
};

const columns = [
  {
    title: "商品标题",
    dataIndex: "copy_url",
  },
  // {
  //   title: "商品来源",
  //   dataIndex: "item_source",
  // },
  {
    title: "复制时间",
    dataIndex: "c_time",
  },
  // {
  //   title: "复制后商品",
  //   dataIndex: "item_id",
  // },
  {
    title: "复制状态",
    dataIndex: "status",
  },
];

// 我的记录页面主体
function CopyRecord() {
  const dispatch = useDispatch();
  // const handlerSubmit = (data) => {
  //   data.copy_urls = data.copy_urls.split("\n");
  //   ajaxCreateCopyTask(data);
  // };
  useEffect(() => {
    dispatch(getCopyComplexTasks({}));
    dispatch(getShopInfo({}));
  }, []);
  return (
    <Fragment>
      <PageHeader {...headerProps} />
      <Content>
        <TableArea columns={columns} />
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
