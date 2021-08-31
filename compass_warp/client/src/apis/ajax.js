import axios from "axios";
import { Modal } from "antd";
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

axios.interceptors.response.use(
  function (response) {
    const responseData = response.data;
    if (!responseData.success) {
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
