import React from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Button } from "antd";
import { selectShopInfo } from "@/features/common-slice";
import "antd/dist/antd.css";
import "./index.scss";

const { Header } = Layout;

function PageHeader(props) {
  const shopInfo = useSelector(selectShopInfo);
  const { nick, deadline } = shopInfo;
  return (
    <Header>
      <div className="logo">
        <h1>
          <a href="/index">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
            快捷搬家上货
          </a>
        </h1>
      </div>
      <div className="menus">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[props.activeLink]}
        >
          {props.menus.map((menu) => {
            return (
              <Menu.Item key={menu.key}>
                <a href={menu.link}>{menu.name}</a>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <div className="user">
        <span>店铺名称: {nick}</span>
        <span>到期时间: {deadline}</span>
      </div>
      <div className="operate">
        <Button type="primary">联系我们</Button>
        <Button type="primary" danger>
          续费
        </Button>
      </div>
    </Header>
  );
}

export default PageHeader;
