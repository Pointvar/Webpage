import axios from "axios";
import { Modal } from "antd";

axios.interceptors.response.use(
  function (response) {
    return response.data.data;
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
