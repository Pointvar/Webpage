import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/store";

import { Form, Input, InputNumber, Cascader, Button, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Layout } from "antd";
const { Content } = Layout;
const { Option } = Select;

import PageHeader from "@/components/page-header";
import InputArea from "@/components/input-area";
import PropTabs from "@/components/prop-tabs";
import PageFooter from "@/components/page-footer";

import { NAV_MENUS } from "@/constants/common";
import { getShopInfo } from "@/features/common-slice";
import { getLogisticTemplates, selectlogisticTemplates, createCopyTask } from "@/features/copy-slice";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  menus: NAV_MENUS,
  activeLink: "link-copy",
};

// 表单默认参数
const initialValues = {
  copy_urls: [],
  item_set: {
    categray: "AUTO",
    filter: true,
    item_status: "ONSALE",
    item_detail: "AUTO",
    item_title: "FRONT",
    ship_id: "ADD",
    custom_category: null,
  },
  price_set: {
    group_price: { times: 100, operator: "ADD", offset: 0 },
    singly_price: { times: 100, operator: "ADD", offset: 1 },
    market_price: { times: 100, operator: "ADD", offset: 2 },
    decimal_type: "CUT",
  },

  advanced_set: {
    item_title: "FRONT",
    item_stock: "KEEP",
    custom_stock: null,
    shipment_type: "HOUR12",
    item_track: "DEFAULT",
  },
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
  activeTab: "item_set",
  tabInfos: [
    {
      tabKey: "item_set",
      tabTitle: "商品设置",
      tabContents: [
        {
          label: "商品类目",
          name: ["item_set", "categray"],
          type: "radio_select",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "智能匹配" },
            { key: "MANUAL", value: "手动选择" },
          ],
          tips: (
            <span>
              设置复制后商品的类目
              <hr />
              ①智能匹配: 智能AI自动选择合适的商品类目。
              <br />
              ②手工选择: 用户手动自定义选择商品类目。
            </span>
          ),
          component: {
            showValue: "MANUAL",
            name: ["item_set", "custom_category"],
            placeholder: "提示: 请点击选择商品类目",
            ruleMessage: "检测到自定义商品类目为空，请选择智能匹配或输入商品类目！",
            optionInfos: options,
          },
        },
        {
          label: "运费模版",
          name: ["item_set", "ship_id"],
          type: "select",
          defaultValue: null,
          selectInfos: [],
          tips: (
            <span>
              设置复制后商品的运费模版
              <hr />
              ①若有运费模版，默认选择第一个运费模版。
              <br />
              ②若无运费模版，请点击右侧创建运费模版按钮。创建后刷新当前页面！
            </span>
          ),
        },
        {
          label: "商品状态",
          name: ["item_set", "item_status"],
          type: "radio",
          defaultValue: "ONSALE",
          selectInfos: [
            { key: "ONSALE", value: "出售中" },
            { key: "STOCK", value: "仓库中" },
            { key: "DRAFT", value: "草稿箱" },
          ],
          tips: (
            <span>
              设置搬家后商品的状态
              <hr />
              ①出售中: 将商品上架，展示在出售中。
              <br />
              ②仓库中: 将商品下架，展示在仓库中。
              <br />
              ②草稿箱: 将商品提交到草稿箱，展示在草稿箱中。
            </span>
          ),
        },
        {
          label: "商品过滤",
          name: ["item_set", "filter"],
          type: "radio",
          defaultValue: true,
          selectInfos: [
            { key: true, value: "过滤已复制商品" },
            { key: false, value: "不过滤已复制商品" },
          ],
          tips: <span>设置是否过滤曾经搬家过的商品链接</span>,
        },
      ],
    },
    {
      tabKey: "price_set",
      tabTitle: "价格设置",
      tabContents: [
        {
          label: "拼单价格",
          name: ["price_set", "group_price"],
          type: "price_set",
          component: {
            showValue: true,
            priceNames: {
              time: ["price_set", "group_price", "times"],
              operator: ["price_set", "group_price", "operator"],
              offset: ["price_set", "group_price", "offset"],
            },
            prefix: "拼单价格 = 原商品价格 x",
          },
        },
        {
          label: "单买价格",
          name: ["price_set", "singly_price"],
          type: "price_set",
          component: {
            showValue: true,
            priceNames: {
              time: ["price_set", "singly_price", "times"],
              operator: ["price_set", "singly_price", "operator"],
              offset: ["price_set", "singly_price", "offset"],
            },
            prefix: "单买价格 = 原商品价格 x",
          },
        },
        {
          label: "市场价格",
          name: ["price_set", "market_price"],
          type: "price_set",
          component: {
            showValue: true,
            priceNames: {
              time: ["price_set", "market_price", "times"],
              operator: ["price_set", "market_price", "operator"],
              offset: ["price_set", "market_price", "offset"],
            },
            prefix: "市场价格 = 原市场价格 x",
          },
        },
      ],
    },

    {
      tabKey: "advanced_set",
      tabTitle: "标题&库存&时效设置",
      tabContents: [
        {
          label: "商品标题",
          name: ["advanced_set", "item_title"],
          type: "radio",
          defaultValue: "FRONT",
          selectInfos: [
            { key: "FRONT", value: "截取前面30个字符" },
            { key: "END", value: "截取后面30个字符" },
          ],
          tips: <span>设置搬家后商品的标题</span>,
        },
        {
          label: "商品库存",
          name: ["advanced_set", "item_stock"],
          type: "radio_inputnum",
          defaultValue: "KEEP",
          selectInfos: [
            { key: "KEEP", value: "保持原库存" },
            { key: "MANUAL", value: "自定义库存" },
          ],
          tips: <span>设置搬家后商品的库存</span>,
          component: {
            showValue: "MANUAL",
            name: ["advanced_set", "custom_stock"],
            ruleMessage: "检测到自定义库存为空，请输入库存。",
          },
        },
        {
          label: "发货时效",
          name: ["advanced_set", "shipment_type"],
          type: "radio",
          defaultValue: "HOUR24",
          selectInfos: [
            { key: "HOUR24", value: "24小时内" },
            { key: "HOUR48", value: "48小时内" },
            { key: "HOUR12", value: "当天发货" },
          ],
          tips: (
            <span>
              设置搬家后商品的发货时效
              <hr />
              ①按照实际发货时效选择，默认为24小时内发货
            </span>
          ),
        },
      ],
    },
  ],
};

// 一键复制页面主体
function LinkCopy() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const logisticTemplates = useSelector(selectlogisticTemplates);

  useEffect(() => {
    dispatch(getShopInfo());
    dispatch(getLogisticTemplates());
    // logisticTemplates.length && form.setFieldsValue({ item_set: { ship_id: logisticTemplates[0].key } });
  }, []);
  if (logisticTemplates.length) {
    CopyTabProps.tabInfos[0].tabContents[1].selectInfos = logisticTemplates;
    CopyTabProps.tabInfos[0].tabContents[1].defaultValue = logisticTemplates[0].key;
    initialValues.item_set.ship_id = logisticTemplates[0].key;
  }

  const handlerCopySubmit = (data) => {
    data.copy_urls = data.copy_urls.split("\n");
    dispatch(createCopyTask(data));
  };
  const onValuesChange = (x, y) => {
    console.log("xxxxxx", x, y);
  };
  return (
    <Fragment>
      <PageHeader {...headerProps} />
      <Content>
        <Form initialValues={initialValues} form={form} onFinish={handlerCopySubmit} onValuesChange={onValuesChange}>
          <InputArea />
          <PropTabs {...CopyTabProps} form={form} />
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
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

// {
//   label: "价格处理",
//   name: ["price_set", "decimal_type"],
//   type: "radio",
//   defaultValue: "CUT",
//   selectInfos: [
//     { key: "CUT", value: "截取2位小数" },
//     { key: "ROUND", value: "四舍五入保留2位小数" },
//     { key: "DROP", value: "舍弃小数部分" },
//   ],
//   tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
//   <span>
//   设置商品的价格如何处理
//   <hr />
//   ①截取2位小数: 直接截取2位小数 eg:如果原价格100.345。
//   <br />
//   ②仓库中: 将商品下架，展示在仓库中。
//   <br />
//   ②草稿箱: 将商品提交到草稿箱，展示在草稿箱中。
// </span>
// },

// {
//   label: "商品详情",
//   name: ["item_set", "item_detail"],
//   type: "radio",
//   defaultValue: "AUTO",
//   selectInfos: [
//     { key: "AUTO", value: "自动" },
//     { key: "PC", value: "电脑端" },
//     { key: "WX", value: "手机端" },
//   ],
//   tips: (
//     <span>
//       设置搬家后商品详情页使用源宝贝的哪种详情页
//       <hr />
//       ①自动: 根据源商品链接自动确定
//       <br />
//       ②电脑端: 使用电脑端详情页
//       <br />
//       ②手机端: 使用电脑端详情页
//     </span>
//   ),
// },
// {
//   label: "商品标注",
//   name: ["advanced_set", "item_track"],
//   type: "radio",
//   defaultValue: "DEFAULT",
//   selectInfos: [{ key: "DEFAULT", value: "源平台标识-源宝贝编号" }],
//   tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
// },
