import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import store from "store";

import { Form, Button } from "antd";
import { Layout } from "antd";
const { Content } = Layout;

import PageHeader from "components/page-header";
import InputArea from "components/input-area";
import CopyPropTabs from "containers/copy-prop-tabs";
import PageFooter from "components/page-footer";

import { NAV_MENUS } from "constants/common";
import { getShopInfo } from "actions/link-copy";

import "antd/dist/antd.css";
import "./index.scss";

const headerProps = {
  menus: NAV_MENUS,
  activeLink: "link-copy",
};
function LinkCopy() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getShopInfo({}));
  }, []);
  return (
    <Fragment>
      <PageHeader {...headerProps} />
      <Content>
        <Form>
          <InputArea />
          <CopyPropTabs />
          <Button type="primary">开始复制</Button>
        </Form>
      </Content>
      <PageFooter />
    </Fragment>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <LinkCopy />
  </Provider>,
  document.getElementById("root")
);
