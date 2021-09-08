import React from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import "./index.scss";

function TableArea(props) {
  const { rowSelection, dataSource, columns } = props;
  return (
    <div className="table-area-box">
      <Table tableLayout="fixed" rowSelection={rowSelection} dataSource={dataSource} columns={columns} bordered rowKey="_id" />
    </div>
  );
}

export default TableArea;
