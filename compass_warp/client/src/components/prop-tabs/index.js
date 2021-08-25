import React from "react";
import { Cascader, Tabs, Radio, Form } from "antd";

import "antd/dist/antd.css";
import "./index.scss";

const { TabPane } = Tabs;

// 单个属性值
function PropElement(props) {
  const { label, name, defaultValue, selectInfos } = props;
  const [value, setValue] = React.useState(defaultValue);
  const handelerRaidoChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="prop-box">
      <Form.Item name={name}>
        <div className="prop-element">
          <span>{label}:</span>
          <Radio.Group onChange={handelerRaidoChange} value={value}>
            {selectInfos.map((selectInfo) => {
              const { key, value } = selectInfo;
              return (
                <Radio value={key} key={key}>
                  {value}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      </Form.Item>
      {label === "类目设置" && value === "MANUAL" ? (
        <Form.Item
          name="custom_category"
          rules={[
            {
              required: true,
              message:
                "检测到自定义商品类目为空，请选择智能匹配或输入商品类目。",
            },
          ]}
        >
          <Cascader
            options={props.options}
            changeOnSelect
            placeholder="提示：请点击输入商品类目。"
            style={{ width: "300px" }}
          />
        </Form.Item>
      ) : null}
    </div>
  );
}

// 渲染属性页面
function PropTabs(props) {
  const { activeTab, tabInfos } = props;
  return (
    <div className="prop-tabs">
      <Tabs defaultActiveKey={activeTab}>
        {tabInfos.map((tabInfo) => {
          const { tabKey, tabTitle, tabContents } = tabInfo;
          return (
            <TabPane tab={tabTitle} key={tabKey}>
              {tabContents.map((tabContent, index) => {
                return <PropElement {...tabContent} key={index} />;
              })}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

export default PropTabs;
