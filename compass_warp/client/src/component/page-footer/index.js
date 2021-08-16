import React, { Component, Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Layout } from "antd";

const { Footer } = Layout;

class PageFooter extends Component {
  render() {
    return (
      <Layout>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
}

export default PageFooter;
