import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import "./index.scss";

function TableArea(props, ref) {
  const tableRef = useRef(null);
  const { rowSelection, dataSource, columns } = props;
  useImperativeHandle(ref, () => ({
    getCurrentPageData: () => {
      const currentDoms = Array.from(tableRef.current.querySelectorAll(".ant-table-row"));
      const currentIds = currentDoms.map((element) => element.getAttribute("data-row-key"));
      return currentIds;
    },
  }));

  return (
    <div className="table-area-box" ref={tableRef}>
      <Table tableLayout="fixed" rowKey="_id" bordered rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default forwardRef(TableArea);
