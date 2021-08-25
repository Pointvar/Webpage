import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";

import { Form, Button } from "antd";
import { Layout } from "antd";
const { Content } = Layout;

import PageHeader from "@/components/page-header";
import InputArea from "@/components/input-area";
import PropTabs from "@/components/prop-tabs";
import PageFooter from "@/components/page-footer";

import { NAV_MENUS } from "@/constants/common";
import { getShopInfo } from "@/features/common-slice";
import { ajaxCreateCopyTask } from "@/apis";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  menus: NAV_MENUS,
  activeLink: "link-copy",
};

// 表单默认参数
const initialValues = {
  copy_urls: [],
  categray: "AUTO",
  filter: true,
  item_status: "ONSALE",
  item_detail: "AUTO",
  custom_category: [],
};

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hanzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const CopyTabProps = {
  activeTab: "copy-setting",
  tabInfos: [
    {
      tabKey: "copy-setting",
      tabTitle: "复制设置",
      tabContents: [
        {
          label: "类目设置",
          name: "categray",
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "智能匹配" },
            { key: "MANUAL", value: "手动选择" },
          ],
          options: options,
        },
        {
          label: "是否过滤",
          name: "filter",
          type: "radio",
          defaultValue: true,
          selectInfos: [
            { key: true, value: "过滤已复制商品" },
            { key: false, value: "不过滤已复制商品" },
          ],
        },
        {
          label: "商品状态",
          name: "item_status",
          type: "radio",
          defaultValue: "ONSALE",
          selectInfos: [
            { key: "ONSALE", value: "出售中" },
            { key: "STOCK", value: "仓库中" },
            { key: "DRAFT", value: "草稿箱" },
          ],
        },
        {
          label: "商品详情",
          name: "item_detail",
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "自动" },
            { key: "PC", value: "电脑端" },
            { key: "WX", value: "手机端" },
          ],
        },
      ],
    },
    {
      tabKey: "basic-setting",
      tabTitle: "基础设置",
      tabContents: [
        {
          label: "类目设置",
          name: "categray",
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "智能匹配" },
            { key: "MANUAL", value: "手动选择" },
          ],
          options: options,
        },
      ],
    },
    {
      tabKey: "advanced-setting",
      tabTitle: "高级设置",
      tabContents: [
        {
          label: "类目设置",
          name: "categray",
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "智能匹配" },
            { key: "MANUAL", value: "手动选择" },
          ],
          options: options,
        },
      ],
    },
  ],
};

// 一键复制页面主体
function LinkCopy() {
  const dispatch = useDispatch();
  const handlerSubmit = (data) => {
    ajaxCreateCopyTask(data);
  };
  useEffect(() => {
    dispatch(getShopInfo());
  }, []);
  return (
    <Fragment>
      <PageHeader {...headerProps} />
      <Content>
        <Form initialValues={initialValues} onFinish={handlerSubmit}>
          <InputArea />
          <PropTabs {...CopyTabProps} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              开始复制
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <PageFooter />
    </Fragment>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <LinkCopy />
  </Provider>,
  document.getElementById("root")
);
