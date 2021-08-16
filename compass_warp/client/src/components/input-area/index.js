import React, { Fragment } from "react";
import { Input } from "antd";
import "antd/dist/antd.css";
import "./index.css";

import taobaoLogo from "../../public/taobao_logo.png";
import tmallLogo from "../../public/tmall_logo.png";
const { TextArea } = Input;

function InputArea() {
  return (
    <Fragment>
      <div id="platforms">
        <span className="input_tips">支持平台:</span>
        <a href="https://www.taobao.com/" target="_blank">
          <img src={taobaoLogo} />
        </a>
        <a href="https://www.tmall.com/" target="_blank">
          <img src={tmallLogo} />
        </a>
      </div>
      <div id="input-area">
        <span className="input_tips">输入链接:</span>
        <TextArea
          rows={10}
          allowClear
          bordered
          placeholder="提示：支持输入不同平台的宝贝链接，一次可输入多个宝贝链接。"
        />
      </div>
    </Fragment>
  );
}

export default InputArea;
