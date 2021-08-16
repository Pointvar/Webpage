import React, { Fragment } from "react";
import { Cascader, Tabs, Radio } from "antd";

const { TabPane } = Tabs;
import "antd/dist/antd.css";
import "./index.css";

function ManualSelect() {
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
  return (
    <Cascader options={options} changeOnSelect style={{ width: "300px" }} />
  );
}

function CopyTabs(props) {
  const { activeTab, tabInfos } = props;
  return (
    <div id="copy-tabs">
      <Tabs defaultActiveKey={activeTab}>
        {tabInfos.map((tabInfo) => {
          const { tabIndex, tabTitle, tabContents } = tabInfo;
          return (
            <TabPane tab={tabTitle} key={tabIndex}>
              {tabContents.map((tabContent, index) => {
                return <CopyProps {...tabContent} key={index} />;
              })}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

function CopyProps(props) {
  const { defaultValue, title, selectInfos } = props;
  const [value, setValue] = React.useState(defaultValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <Fragment>
      <div className="base-setting">
        <span>{title}:</span>
        <Radio.Group onChange={onChange} value={value}>
          {selectInfos.map((selectInfo) => {
            const { key, value } = selectInfo;
            return (
              <Radio value={key} key={key}>
                {value}
              </Radio>
            );
          })}
          {title === "类目设置" && value === "manual" ? <ManualSelect /> : null}
        </Radio.Group>
      </div>
    </Fragment>
  );
}

export default CopyTabs;
