import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./index.scss";

const { Footer } = Layout;

function PageFooter() {
  return (
    <Footer className="footer-container">
      <span>杭州矩阵云网络技术有限公司版权所有©</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
        浙ICP备2021026933号
      </a>
    </Footer>
  );
}

export default PageFooter;
