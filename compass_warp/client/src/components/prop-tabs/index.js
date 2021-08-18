import React from "react";
import { Cascader, Tabs, Radio, Form } from "antd";

import "antd/dist/antd.css";
import "./index.scss";
const { TabPane } = Tabs;

// 选择框
function ManualSelect(props) {
  const { options } = props;
  return (
    <Cascader options={options} changeOnSelect style={{ width: "300px" }} />
  );
}

// 单个属性值
function PropElement(props) {
  const { label, name, defaultValue, selectInfos } = props;
  const [value, setValue] = React.useState(defaultValue);
  console.log("x", value);

  const handelerRaidoChange = (e) => {
    setValue(e.target.value);
  };
  return (
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
          {label === "类目设置" && value === "manual" ? (
            <ManualSelect options={props.options} />
          ) : null}
        </Radio.Group>
      </div>
    </Form.Item>
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
