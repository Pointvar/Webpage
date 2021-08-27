import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";

import "antd/dist/antd.css";
import "./index.scss";

import { Form, Input, Select, Tooltip, Button, Space, Typography } from "antd";

const { Option } = Select;
const xxx = (
  <Form>
    <Form.Item label="Address" noStyle></Form.Item>
  </Form>
);

// 一键复制页面主体
function Test() {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return <div>{xxx}</div>;
}

ReactDOM.render(
  <Provider store={store}>
    <Test />
  </Provider>,
  document.getElementById("root")
);
