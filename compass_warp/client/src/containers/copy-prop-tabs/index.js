import React from "react";
import PropTabs from "components/prop-tabs";

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

function CopyPropTabs() {
  return <PropTabs {...CopyTabProps} />;
}

export default CopyPropTabs;
