import React from "react";
import { Input, Button, Table, Select, Popconfirm } from "antd";
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
            <Search placeholder="支持源ID和上货后ID搜索" allowClear style={{ width: 230 }} onSearch={onSearchId} />
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
          <Button className="filter_element" type="primary" onClick={onClickRestSearch}>
            搜索重置
          </Button>
        </div>

        <div className="operator">
          <div className="operator_info">
            <div>
              已选择:<span className="selectMessage">{selectedKeys.length}</span>条
            </div>
            <div>总记录:{dataSource.length}条</div>
          </div>
          <Popconfirm
            title={
              <span>
                亲，确定删除已选择的上货记录吗?
                <br />
                该操作仅会删除软件内记录，不删除店铺内商品。
              </span>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={onClickHideTasks}
          >
            <Button type="primary" danger>
              删除已选
            </Button>
          </Popconfirm>
        </div>
      </div>

      {
        <Table
          tableLayout="fixed"
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          bordered
          rowKey="_id"
        />
      }
    </div>
  );
}

export default TableArea;
