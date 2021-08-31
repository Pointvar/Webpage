import React from "react";
import { useSelector } from "react-redux";

import { selectComplexTasks } from "@/features/copy-slice";
import { Table, Select } from "antd";
const { Option } = Select;
// import { _ } from "lodash";

import "antd/dist/antd.css";
import "./index.scss";

function TableArea(props) {
  // const filterTasks = (datas, filter) =>{
  // //   const {str, platform, status} = filter
  // //   if (str){
  // //     datas = datas.filter((element) =>{
  // //       copy
  // //       _.includes(element.copy_info.)
  // //       element.item_id ===
  // //     })
  // //   }
  // // }
  const complexTasks = useSelector(selectComplexTasks);

  // const filter = useSelector(selectFilter);

  const platformMaps = [
    { key: "all", value: "全部" },
    { key: "taobao", value: "淘宝" },
  ];
  // dataSource={dataSource} columns={columns}

  // c_time: "2021-08-30T09:33:38.601"
  // copy_url: "https://detail.tmall.com/item.htm?spm=a220o.1000855.w4023-18952390023.4.6c8fc8a2u9RAmH&id=610515798400"
  // m_time: "2021-08-30T09:33:38.601"
  // nick: "pdd88853051977"
  // platform: "pinduoduo"
  // sid: "888530519"
  // soft_code: "kjsh"
  // status: "#WAIT#"
  // task_id: "c811bb3a6503f0b7398cf719b61ed59458c5b7deb06290fd8adc694d542de2bf"
  // _id: "b8f1743a0a59dc024f89dfb59442b43dfe8aed32434d5b7403e68c4c67a5b30c"

  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const onSelectChange = (keys) => {
    setSelectedKeys(keys);
  };
  // const [filterPlatform, setfilterPlatform] = React.useState([]);
  // function handleChange(value) {
  //   console.log(`selected ${value}`);
  // }
  const rowSelection = {
    selectedKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };
  return (
    <div className="input-area-box">
      <span>商品来源:</span>
      <Select defaultValue="all" style={{ width: 120 }}>
        {platformMaps.map(({ key, value }) => {
          return (
            <Option key={key} value={key}>
              {value}
            </Option>
          );
        })}
      </Select>
      {<Table rowSelection={rowSelection} dataSource={complexTasks} columns={props.columns} rowKey="_id" />}
    </div>
  );
}

export default TableArea;
