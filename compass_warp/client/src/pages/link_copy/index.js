import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/store";

import { InfoCircleTwoTone, InfoCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { Form, Button, Modal, Layout, ConfigProvider } from "antd";
const { Content } = Layout;

import zhCN from "antd/lib/locale/zh_CN";

import PageHeader from "@/components/page-header";
import InputArea from "@/components/input-area";
import PropTabs from "@/components/prop-tabs";
import PageFooter from "@/components/page-footer";
import _ from "lodash";

import { NAV_MENUS } from "@/constants/common";
import { getShopInfo, selectShopInfo } from "@/features/common-slice";
import {
  getLogisticTemplates,
  selectlogisticTemplates,
  createCopyTask,
  getAuthorizeCats,
  selectAuthorizeCats,
} from "@/features/copy-slice";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  NavMenus: NAV_MENUS,
  activeLink: "link_copy",
};

// 表单默认参数
const initialValues = {
  copy_urls: "",
  item_set: {
    categray_type: "#AUTO#",
    filter_same: true,
    item_status: "#ONSALE#",
    item_cut: "#FRONT#",
    ship_id: null,
    custom_category: null,
  },
  price_set: {
    group_price: { times: 100, operator: "#ADD#", offset: 0 },
    singly_price: { times: 100, operator: "#ADD#", offset: 1 },
    market_price: { times: 100, operator: "#ADD#", offset: 2 },
  },

  advanced_set: {
    item_cut: "#FRONT#",
    item_stock: "#KEEP#",
    custom_stock: null,
    shipment_type: "#HOUR24#",
  },
};
const CopyTabProps = {
  activeTab: "item_set",
  tabInfos: [
    {
      tabKey: "item_set",
      tabTitle: "商品设置",
      tabContents: [
        {
          label: "商品类目",
          name: ["item_set", "categray_type"],
          type: "radio_select",
          selectInfos: [
            { key: "#AUTO#", value: "智能匹配" },
            { key: "#MANUAL#", value: "手动选择" },
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
            showValue: "#MANUAL#",
            name: ["item_set", "custom_category"],
            placeholder: "提示: 请点击选择商品类目",
            ruleMessage: "检测到自定义商品类目为空，请选择智能匹配或输入商品类目！",
            fieldNames: null,
            optionInfos: [],
          },
        },
        {
          label: "运费模版",
          name: ["item_set", "ship_id"],
          type: "select",
          selectInfos: [],
          tips: (
            <span>
              设置复制后商品的运费模版
              <hr />
              ①若有运费模版，默认选择第一个运费模版。
              <br />
              ②若无运费模版，请点击右侧运费模版管理按钮。创建模版后刷新当前页面！
            </span>
          ),
          ruleMessage: "检测到无运费模版！请点击右侧运费模版管理按钮，创建模版后刷新当前页面重试。",
        },
        {
          label: "商品状态",
          name: ["item_set", "item_status"],
          type: "radio",
          selectInfos: [
            { key: "#ONSALE#", value: "出售中" },
            { key: "#STOCK#", value: "仓库中" },
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
          name: ["item_set", "filter_same"],
          type: "radio",
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
          name: ["price_set", "tips"],
          type: "component",
          component: (
            <div className="prop-box">
              <div style={{ fontSize: 16, margin: "2px 0px 6px 0px" }} className="prop-tips">
                <InfoCircleTwoTone />
                {
                  "拼多多规定: ①市场价格>单买价格>团购价格。②商品加价幅度(团购价)不能超过源平台实际销售价格的8%，因此超价商品会自动修改为加价8%。"
                }
              </div>
            </div>
          ),
        },
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
            tips: (
              <div className="prop-tips">
                <InfoCircleOutlined />
                <span>{"例: 源商品价格为1000元，则最终价格为: 1000 * 100% + 0 = 1000元"}</span>
              </div>
            ),
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
            tips: (
              <div className="prop-tips">
                <InfoCircleOutlined />
                <span>{"例: 源商品价格为1000元，则最终价格为: 1000 * 100% + 1 = 1001元"}</span>
              </div>
            ),
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
            tips: (
              <div className="prop-tips">
                <InfoCircleOutlined />
                <span>{"例: 源商品价格为1000元，则最终价格为: 1000 * 100% + 2 = 1002元"}</span>
              </div>
            ),
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
          name: ["advanced_set", "item_cut"],
          type: "radio",
          selectInfos: [
            { key: "#FRONT#", value: "截取前面30个字符" },
            { key: "#END#", value: "截取后面30个字符" },
          ],
          tips: <span>设置搬家后商品的标题</span>,
        },
        {
          label: "商品库存",
          name: ["advanced_set", "item_stock"],
          type: "radio_inputnum",
          selectInfos: [
            { key: "#KEEP#", value: "保持原库存" },
            { key: "#MANUAL#", value: "自定义库存" },
          ],
          tips: <span>设置搬家后商品的库存</span>,
          component: {
            showValue: "#MANUAL#",
            name: ["advanced_set", "custom_stock"],
            ruleMessage: "检测到自定义库存为空，请输入库存。",
          },
        },
        {
          label: "发货时效",
          name: ["advanced_set", "shipment_type"],
          type: "radio",
          selectInfos: [
            { key: "#HOUR24#", value: "24小时内" },
            { key: "#HOUR48#", value: "48小时内" },
            { key: "#HOUR12#", value: "当天发货" },
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
  const shopInfo = useSelector(selectShopInfo);
  const logisticTemplates = useSelector(selectlogisticTemplates);
  const authorizeCats = useSelector(selectAuthorizeCats);

  useEffect(() => {
    dispatch(getShopInfo());
    dispatch(getLogisticTemplates());
    dispatch(getAuthorizeCats());
  }, []);
  if (logisticTemplates.length) {
    CopyTabProps.tabInfos[0].tabContents[1].selectInfos = logisticTemplates;
    initialValues.item_set.ship_id = logisticTemplates[0].key;
  }
  CopyTabProps.tabInfos[0].tabContents[0].component.optionInfos = authorizeCats;
  CopyTabProps.tabInfos[0].tabContents[0].component.fieldNames = { label: "cat_name", value: "cat_id", children: "child_cats" };

  const handlerCopySubmit = (data) => {
    data.copy_urls = data.copy_urls.split("\n");
    dispatch(createCopyTask(data)).then((data) => {
      if (_.includes(data.type, "fulfilled")) {
        Modal.confirm({
          content: (
            <div>
              <p>共提交:{data.payload.copy_urls.length}条上货任务</p>
              <p>成功了:{data.payload.valid_urls.length}条上货任务</p>
              <p>相同过滤:{data.payload.filter_urls.length}条上货任务</p>
              <p>无效链接:{data.payload.invalid_urls.length}条上货任务</p>
            </div>
          ),
          icon: <CheckCircleTwoTone />,
          okText: <a href="/copy_record">查看记录</a>,
          cancelText: "继续复制",
          onCancel: () => {
            form.setFieldsValue({ copy_urls: "" });
          },
        });
      }
    });
  };
  const onChangeFormatInput = (event) => {
    const preValue = event.target.value + "https://";
    const matchUrls = preValue.match(/https?.*?(?=(https?:\/\/|\n))/g);
    let copy_urls;
    if (matchUrls) {
      const filterUrls = Array.from(new Set(matchUrls));
      copy_urls = filterUrls.join("\n");
      form.setFieldsValue({ copy_urls: copy_urls });
    }
  };

  return (
    <Fragment>
      <PageHeader {...headerProps} shopInfo={shopInfo} />
      <Content>
        <Form initialValues={initialValues} form={form} requiredMark={false} onFinish={handlerCopySubmit}>
          <InputArea onChangeFormatInput={onChangeFormatInput} />
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
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <LinkCopy />
    </Provider>
  </ConfigProvider>,
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
