import React from "react";
import { Input, Button, Table, Select } from "antd";
const { Option } = Select;
const { Search } = Input;

import "antd/dist/antd.css";
import "./index.scss";

function TableArea({
  columns,
  statusMaps,
  platformMaps,
  dataSource,
  selectedKeys,
  rowSelection,
  onSearchTitle,
  onSearchId,
  onSearchPlatform,
  onSearchStatus,
  onClickRestSearch,
  onClickHideTasks,
}) {
  return (
    <div className="table-area-box">
      <div className="table_header">
        <div className="filter_box">
          <div className="filter_element">
            <span className="label">标题搜索:</span>
            <Search placeholder="支持商品标题模糊搜索" allowClear onSearch={onSearchTitle} />
          </div>
          <div className="filter_element">
            <span className="label">商品ID搜索:</span>
            <Search placeholder="支持源ID和复制后ID搜索" allowClear style={{ width: 230 }} onSearch={onSearchId} />
          </div>
          <div className="filter_element">
            <span className="label">商品来源:</span>
            <Select defaultValue="#ALL#" style={{ width: 84 }} onChange={onSearchPlatform}>
              {platformMaps.map(({ key, value }) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className="filter_element">
            <span className="label">上货状态:</span>
            <Select defaultValue="#ALL#" style={{ width: 84 }} onChange={onSearchStatus}>
              {statusMaps.map(({ key, value }) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </div>
          <Button type="primary" onClick={onClickRestSearch}>
            搜索重置
          </Button>
        </div>

        <div className="operator">
          <div className="operator_info">
            <div>
              已选择:<span className="selectMessage">{selectedKeys.length}</span>
            </div>
            <div>记录数:{dataSource.length}</div>
          </div>
          <Button type="primary" danger onClick={onClickHideTasks}>
            删除已选
          </Button>
        </div>
      </div>

      {<Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} rowKey="_id" />}
    </div>
  );
}

export default TableArea;
