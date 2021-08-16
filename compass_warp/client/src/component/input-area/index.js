import React, { Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Input } from "antd";
const { TextArea } = Input;

function InputArea() {
  return (
    <Fragment>
      <div id="platforms">
        <span className="input_tips">支持平台:</span>
        <a href="https://www.taobao.com/" target="_blank">
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
        </a>
        <a href="https://www.taobao.com/" target="_blank">
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
        </a>
      </div>
      <div id="input-area">
        <span className="input_tips">输入链接:</span>
        <TextArea
          rows={10}
          allowClear
          bordered
          defaultValue="提示：可输入淘宝宝贝地址，多个地址请用回车键换行。"
        />
      </div>
    </Fragment>
  );
}

export default InputArea;
