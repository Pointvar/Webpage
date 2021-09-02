import React, { Fragment, useState } from "react";
import { Tabs, Radio, Form, Cascader, Select, Input, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
let { Option } = Select;

import "antd/dist/antd.css";
import "./index.scss";

const { TabPane } = Tabs;

function PropRadio(props) {
  // 简单的单项选择组件
  const { label, name, defaultValue, selectInfos, tips, component = null } = props;
  const [value, setValue] = useState(defaultValue);
  const onChangeRadio = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="prop-box">
      <Form.Item name={name} label={label} tooltip={{ title: tips, icon: <InfoCircleOutlined /> }}>
        <div className="prop-element">
          <Radio.Group onChange={onChangeRadio} value={value}>
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

function PropRadioSelect(props) {
  // 单选+多级选择组件
  const { name, placeholder, ruleMessage, optionInfos } = props.component;
  const fragment = (
    <Fragment>
      <Form.Item
        name={name}
        rules={[
          {
            required: true,
            message: ruleMessage,
          },
        ]}
      >
        <Cascader options={optionInfos} changeOnSelect placeholder={placeholder} style={{ width: "300px" }} />
      </Form.Item>
    </Fragment>
  );
  props.component.fragment = fragment;
  return <PropRadio {...props} />;
}

function PropRadioInputNum(props) {
  // 单选+数字输入组件
  const { name, ruleMessage } = props.component;
  const fragment = (
    <Form.Item
      name={name}
      rules={[
        {
          required: true,
          message: ruleMessage,
        },
      ]}
    >
      <InputNumber min={0} max={100000} />
    </Form.Item>
  );
  props.component.fragment = fragment;
  return <PropRadio {...props} />;
}

function PropSelect(props) {
  //  简单的选择框
  const { label, name, defaultValue, selectInfos, tips } = props;
  return (
    <div className="prop-box">
      <Form.Item name={name} label={label} tooltip={{ title: tips, icon: <InfoCircleOutlined /> }}>
        <div className="prop-element">
          <Select defaultValue={defaultValue} style={{ width: 140 }}>
            {selectInfos.map((selectInfo) => {
              const { key, value } = selectInfo;
              return (
                <Option value={key} key={key}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </div>
      </Form.Item>
    </div>
  );
}

function PropPriceSet(props) {
  // 价格设置组件
  const { label, name, component } = props;
  const { priceNames, prefix } = component;
  return (
    <div className="prop-box">
      <Form.Item name={name} label={label}>
        <div className="prop-element">
          <Input.Group compact>
            <span>{prefix}</span>
            <Form.Item name={priceNames.time}>
              <InputNumber min={0} max={100} formatter={(value) => `${value}%`} parser={(value) => value.replace("%", "")} />
            </Form.Item>
            <Form.Item name={priceNames.operator}>
              <Select>
                <Option value="ADD">加</Option>
                <Option value="SUB">减</Option>
              </Select>
            </Form.Item>
            <Form.Item name={priceNames.offset}>
              <InputNumber min={0} max={100} />
            </Form.Item>
          </Input.Group>
        </div>
      </Form.Item>
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
              {tabContents.map((tabContent) => {
                const key = tabContent.name.join("_");
                if (tabContent.type === "radio") {
                  return <PropRadio {...tabContent} key={key} />;
                } else if (tabContent.type === "radio_select") {
                  return <PropRadioSelect {...tabContent} key={key} />;
                } else if (tabContent.type === "select") {
                  return <PropSelect {...tabContent} key={key} />;
                } else if (tabContent.type === "price_set") {
                  return <PropPriceSet {...tabContent} key={key} />;
                } else if (tabContent.type === "radio_inputnum") {
                  return <PropRadioInputNum {...tabContent} key={key} />;
                } else if (tabContent.type === "component") {
                  console.log("CCCCCCC");
                  return (
                    <div className="prop-box" key={key}>
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
