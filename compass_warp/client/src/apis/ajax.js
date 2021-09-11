import axios from "axios";
import { Modal } from "antd";
import React from "react";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");
if (!csrftoken) {
  Cookies.set("csrftoken", "kGwYOrb7Gh1bZa9oCe4DVbzfUhILmk1jgdzzNIhUDbtxepYVT431qrnRlsyqkFoP");
}

axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

axios.interceptors.response.use(
  function (response) {
    const responseData = response.data;
    if (!responseData.success) {
      if (responseData.data.code === 3000) {
        Modal.error({
          content: responseData.data.msg,
          okText: <a href={responseData.data.process}>点我授权</a>,
        });
        return Promise.reject(responseData);
      }
      Modal.error({
        title: "后端接口调用错误，请联系客服处理。",
        content: responseData.data.msg,
      });
      return Promise.reject(responseData);
    }
    return responseData.data;
  },
  function (error) {
    Modal.error({
      title: "后端接口调用错误，请联系客服处理。",
      content: error.response.statusText,
    });
    return Promise.reject(error);
  }
);

export default axios;
