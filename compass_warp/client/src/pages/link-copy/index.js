import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";

import { Form, Input, InputNumber, Cascader, Button, Select, Tooltip } from "antd";
import { Layout } from "antd";
const { Content } = Layout;
const { Option } = Select;

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
    group_price: { times: 100, operator: "ADD", offset: 2 },
    singly_price: { times: 100, operator: "ADD", offset: 1 },
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
  activeTab: "price_set",
  tabInfos: [
    {
      tabKey: "item_set",
      tabTitle: "商品设置",
      tabContents: [
        {
          label: "商品类目",
          name: ["item_set", "categray"],
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "智能匹配" },
            { key: "MANUAL", value: "手动选择" },
          ],
          tips: "设置复制后商品的类目。智能匹配：AI智能根据商品来源选择合适的商品类目，手工选择：用户可以自定义选择商品类目。",
          component: {
            showValue: "MANUAL",
            fragment: (
              <Form.Item
                name={["item_set", "custom_category"]}
                rules={[
                  {
                    required: true,
                    message: "检测到自定义商品类目为空，请选择智能匹配或输入商品类目。",
                  },
                ]}
              >
                <Cascader
                  options={options}
                  changeOnSelect
                  placeholder="提示：请点击输入商品类目。"
                  style={{ width: "300px" }}
                />
              </Form.Item>
            ),
          },
        },
        {
          type: "component",
          component: {
            showValue: true,
            fragment: (
              <div className="prop-box">
                <Form.Item
                  label={
                    <Tooltip
                      title={
                        "设置复制后商品的运费模版。默认选择第一个有效的运费模版，若无运费模版，点击下拉框内创建运费模版按钮后前往平台创建运费模版。然后刷新当前页面重新加载刚创建的用户模版。"
                      }
                    >
                      {"运费模版"}
                    </Tooltip>
                  }
                  name={["item_set", "ship_id"]}
                >
                  <Select style={{ width: "140px" }}>
                    <Option value="ADD">加</Option>
                    <Option value="SUB">减</Option>
                  </Select>
                </Form.Item>
              </div>
            ),
          },
        },
        {
          label: "商品详情",
          name: ["item_set", "item_detail"],
          type: "radio",
          defaultValue: "AUTO",
          selectInfos: [
            { key: "AUTO", value: "自动" },
            { key: "PC", value: "电脑端" },
            { key: "WX", value: "手机端" },
          ],
          tips: "设置搬家后商品详情页使用源宝贝的哪种详情页。自动: 根据原商品是电脑端还是手机端自动确定",
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
          tips: "设置搬家后商品的状态。",
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
          tips: "设置是否过滤曾经搬家过的商品链接。",
        },
      ],
    },
    {
      tabKey: "price_set",
      tabTitle: "价格设置",
      tabContents: [
        {
          type: "component",
          component: {
            showValue: true,
            fragment: (
              <div className="prop-box">
                <Form.Item label="拼单价格">
                  <Input.Group compact>
                    <span>拼单价格 = 原商品价格 × </span>
                    <Form.Item name={["price_set", "group_price", "times"]}>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item name={["price_set", "group_price", "operator"]}>
                      <Select>
                        <Option value="ADD">加</Option>
                        <Option value="SUB">减</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["price_set", "group_price", "offset"]}>
                      <InputNumber min={0} max={100} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </div>
            ),
          },
        },
        {
          type: "component",
          component: {
            showValue: true,
            fragment: (
              <div className="prop-box">
                <Form.Item label="单买价格">
                  <Input.Group compact>
                    <span>单买价格 = 原商品价格 × </span>
                    <Form.Item name={["price_set", "singly_price", "times"]}>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item name={["price_set", "singly_price", "operator"]}>
                      <Select>
                        <Option value="ADD">加</Option>
                        <Option value="SUB">减</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["price_set", "singly_price", "offset"]}>
                      <InputNumber min={0} max={100} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </div>
            ),
          },
        },
        {
          type: "component",
          component: {
            showValue: true,
            fragment: (
              <div className="prop-box">
                <Form.Item label="市场价格">
                  <Input.Group compact>
                    <span>市场价格 = 原市场价格 × </span>
                    <Form.Item name={["price_set", "market_price", "times"]}>
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item name={["price_set", "group_price", "operator"]}>
                      <Select>
                        <Option value="ADD">加</Option>
                        <Option value="SUB">减</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={["price_set", "group_price", "offset"]}>
                      <InputNumber min={0} max={100} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </div>
            ),
          },
        },
        {
          label: "价格处理",
          name: ["price_set", "decimal_type"],
          type: "radio",
          defaultValue: "CUT",
          selectInfos: [
            { key: "CUT", value: "截取2位小数" },
            { key: "ROUND", value: "四舍五入保留2位小数" },
            { key: "DROP", value: "舍弃小数部分" },
          ],
          tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
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
          tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
        },
        {
          label: "商品库存",
          name: ["advanced_set", "item_stock"],
          type: "radio",
          defaultValue: "KEEP",
          selectInfos: [
            { key: "KEEP", value: "保持原库存" },
            { key: "MANUAL", value: "自定义库存" },
          ],
          tips: "xxxx222",
          component: {
            showValue: "MANUAL",
            fragment: (
              <Form.Item
                name={["advanced_set", "custom_stock"]}
                rules={[
                  {
                    required: true,
                    message: "检测到自定义商品类目为空，请选择智能匹配或输入商品类目。",
                  },
                ]}
              >
                <InputNumber min={0} max={100000} />
              </Form.Item>
            ),
          },
        },
        {
          label: "发货时效",
          name: ["advanced_set", "shipment_type"],
          type: "radio",
          defaultValue: "HOUR12",
          selectInfos: [
            { key: "HOUR12", value: "当天发货" },
            { key: "HOUR24", value: "24小时内" },
            { key: "HOUR48", value: "48小时内" },
          ],
          tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
        },
        {
          label: "商品标注",
          name: ["advanced_set", "item_track"],
          type: "radio",
          defaultValue: "DEFAULT",
          selectInfos: [{ key: "DEFAULT", value: "源平台标识-源宝贝编号" }],
          tips: "设置搬家后商品详情页使用源宝贝的哪种详情页\n1.自动: 根据原商品自动确定",
        },
      ],
    },
  ],
};

// 一键复制页面主体
function LinkCopy() {
  const dispatch = useDispatch();
  const handlerSubmit = (data) => {
    data.copy_urls = data.copy_urls.split("\n");
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
