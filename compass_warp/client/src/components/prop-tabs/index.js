import React, { Fragment } from "react";
import { Cascader, Tabs, Radio, Form, Tooltip } from "antd";

import "antd/dist/antd.css";
import "./index.scss";

const { TabPane } = Tabs;

// 单个属性值
function PropRadio(props) {
  const {
    label,
    name,
    defaultValue,
    selectInfos,
    tips,
    component = null,
  } = props;
  const [value, setValue] = React.useState(defaultValue);
  const handelerChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="prop-box">
      <Form.Item name={name} label={<Tooltip title={tips}>{label}</Tooltip>}>
        <div className="prop-element">
          <Radio.Group onChange={handelerChange} value={value}>
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
      {component && component.showValue === value ? component.fragment : null}
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
            <TabPane tab={tabTitle} key={tabKey} forceRender>
              {tabContents.map((tabContent, index) => {
                if (tabContent.type === "radio") {
                  return <PropRadio {...tabContent} key={index} />;
                } else if (tabContent.type === "component") {
                  return (
                    <div className="prop-box" key={index}>
                      {tabContent.component.fragment}
                    </div>
                  );
                }
              })}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

export default PropTabs;
