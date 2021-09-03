import React from "react";
import { Input, Form } from "antd";

import "antd/dist/antd.css";
import "./index.scss";

import taobaoLogo from "../../public/taobao_logo.png";
import tmallLogo from "../../public/tmall_logo.png";
const { TextArea } = Input;

function InputArea() {
  return (
    <div className="input-area-box">
      <div className="platforms">
        <span className="input_tips">支持平台:</span>
        <a href="https://www.taobao.com/" target="_blank" rel="noreferrer">
          <img src={taobaoLogo} />
        </a>
        <a href="https://www.tmall.com/" target="_blank" rel="noreferrer">
          <img src={tmallLogo} />
        </a>
      </div>
      <div className="input-area">
        <span className="input_tips">输入链接:</span>
        <Form.Item
          name="copy_urls"
          rules={[
            {
              required: true,
              message: "检测到宝贝链接为空，请输入宝贝链接。",
            },
          ]}
        >
          <TextArea rows={10} allowClear bordered placeholder="提示：支持输入不同平台的宝贝链接，一次可输入多个宝贝链接。" />
        </Form.Item>
      </div>
    </div>
  );
}

export default InputArea;
