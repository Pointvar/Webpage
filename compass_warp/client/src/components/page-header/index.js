import React from "react";
import { useSelector } from "react-redux";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu, Button } from "antd";
const { Header } = Layout;

function PageHeader(props) {
  const data = useSelector((state) => state.data);
  const { nick, deadline } = data;
  return (
    <Header>
      <div id="logo">
        <h1>
          <a href="/index">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
            快捷上货
          </a>
        </h1>
      </div>
      <div id="menus">
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
      <div id="user">
        <span>店铺名称: {nick}</span>
        <span>到期时间: {deadline}</span>
      </div>
      <div id="operate">
        <Button type="primary">联系我们</Button>
        <Button type="primary" danger>
          续费
        </Button>
      </div>
    </Header>
  );
}

export default PageHeader;
