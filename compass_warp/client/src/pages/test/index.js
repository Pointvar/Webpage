import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";

import "antd/dist/antd.css";
import "./index.scss";

import { Form, InputNumber, Select, Tooltip, Button, Space, Typography } from "antd";

// 一键复制页面主体
function Test() {
  return (
    <Space direction="vertical">
      <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} />
    </Space>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Test />
  </Provider>,
  document.getElementById("root")
);
