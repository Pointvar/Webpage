import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Layout, Row, Col } from "antd";
import "antd/dist/antd.css";
import "./index.css";

import PageHeader from "../page-header";
import InputArea from "../input-area";
import CopyTabs from "../copy-tabs";
import { Content } from "antd/lib/layout/layout";

import { getShopInfo } from "../../actions/link-copy";
// import PageFooter from "../page-footer";

const headerProps = {
  menus: [
    {
      name: "一键复制",
      link: "/",
      key: "index",
    },
    {
      name: "整店复制",
      link: "/",
      key: "host",
    },
    {
      name: "我的记录",
      link: "/2",
      key: "rank",
    },
  ],
  activeLink: "index",
  userName: "test",
  userImg: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  deadline: "2019-01-10",
};

const copyTabProps = {
  activeTab: 1,
  tabInfos: [
    {
      tabIndex: 1,
      tabTitle: "复制设置",
      tabContents: [
        {
          defaultValue: "auto",
          title: "类目设置",
          selectInfos: [
            { key: "auto", value: "智能匹配" },
            { key: "manual", value: "手动选择" },
          ],
        },
        {
          defaultValue: "yes",
          title: "是否过滤",
          selectInfos: [
            { key: "yes", value: "过滤已复制商品" },
            { key: "no", value: "不过滤已复制商品" },
          ],
        },
        {
          defaultValue: "onsale",
          title: "商品状态",
          selectInfos: [
            { key: "onsale", value: "出售中" },
            { key: "stock", value: "仓库中" },
            { key: "draft", value: "草稿箱" },
          ],
        },
        {
          defaultValue: "auto",
          title: "商品详情",
          selectInfos: [
            { key: "auto", value: "自动" },
            { key: "pc", value: "电脑端" },
            { key: "wx", value: "手机端" },
          ],
        },
      ],
    },
    {
      tabIndex: 2,
      tabTitle: "基础设置",
      tabContents: [
        {
          defaultValue: "auto",
          title: "类目设置",
          selectInfos: [
            { key: "auto", value: "智能匹配" },
            { key: "manual", value: "手动选择" },
          ],
        },
      ],
    },
  ],
};

function Index() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getShopInfo({}));
  }, []);
  return (
    <Layout>
      <PageHeader {...headerProps} />
      <Content>
        <InputArea />

        <CopyTabs {...copyTabProps} />

        <Row justify="center">
          <Col span={2}>
            <Button type="primary" block>
              开始复制
            </Button>
          </Col>
        </Row>
      </Content>
      {/* <PageFooter /> */}
    </Layout>
  );
}

export default Index;
