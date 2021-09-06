import React from "react";
import { Layout, Menu, Button, Popover, Tooltip } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import kjshLogo from "@/public/kjsh_logo.png";
import "antd/dist/antd.css";
import "./index.scss";

const { Header } = Layout;

const content = (
  <div className="user-popover" style={{ display: "flex", justifyContent: "space-between", width: 180 }}>
    <a href="/auth/pinduoduo_logout">
      <LoginOutlined />
      切换账号
    </a>

    <a href="/auth/pinduoduo_logout" style={{ color: "red" }}>
      <LogoutOutlined />
      退出登陆
    </a>
  </div>
);

function PageHeader({ activeLink, NavMenus, shopInfo }) {
  const { shop_name, shop_logo } = shopInfo;
  return (
    <Header>
      <div className="logo">
        <a href="/index">
          <img src={kjshLogo} />
        </a>
      </div>
      <div className="menus">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[activeLink]} style={{ fontSize: 20 }}>
          {NavMenus.map((menu) => {
            return (
              <Menu.Item key={menu.key}>
                <a href={menu.link}>{menu.name}</a>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <Popover placement="bottom" content={content} trigger="hover">
        <div className="user">
          <img src={shop_logo} />
          <span>{shop_name}</span>
        </div>
      </Popover>
      <div className="operate">
        <Button type="primary">
          <a href="tencent://message/?uin=1655605815">联系我们(Windows)</a>
        </Button>

        <Tooltip title="加入QQ群后联系管理员:958237009">
          <Button type="primary">联系我们(MAC)</Button>
        </Tooltip>
        {/* <Button type="primary" danger>
          续费
        </Button> */}
      </div>
    </Header>
  );
}

export default PageHeader;
