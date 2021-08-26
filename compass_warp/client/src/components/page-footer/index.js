import React from "react";
import { Layout } from "antd";
import policeIcon from "@/public/police_icon.png";
import "antd/dist/antd.css";
import "./index.scss";

const { Footer } = Layout;

function PageFooter() {
  return (
    <Footer>
      <div className="footer-container">
        <span>杭州矩阵云网络技术有限公司版权所有 ©</span>
        {/* <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=xxxxxxxx">
          <img src={policeIcon} />
          浙公网安备 xxxxxxxx号
        </a> */}
      </div>
    </Footer>
  );
}

export default PageFooter;
