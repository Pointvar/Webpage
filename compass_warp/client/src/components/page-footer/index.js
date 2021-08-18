import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./index.scss";

const { Footer } = Layout;

function PageFooter() {
  return (
    <Footer>
      <div className="footer-container">
        <span>杭州矩阵云网络技术有限公司版权所有 ©</span>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602007035">
          <img src="//staticcommprd.wusetech.com/static/images/icon-police.png" />
          浙公网安备 33010602007035号
        </a>
      </div>
    </Footer>
  );
}

export default PageFooter;
