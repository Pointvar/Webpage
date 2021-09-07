import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import { Layout } from "antd";
const { Content, Header } = Layout;

import PageFooter from "@/components/page-footer";

import "antd/dist/antd.css";
import "./index.scss";

// 一键复制页面主体
function Index() {
  return (
    <Fragment>
      <Header>
        <div className="logo">
          <h1>矩阵云</h1>
        </div>
      </Header>
      <Content>
        <div className="banner_text">
          <h1 className="banner_title">拼多多 开店必备</h1>
          <h3 className="banner_slogan">搬家上货不求人</h3>
        </div>
      </Content>
      <PageFooter />
    </Fragment>
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));
