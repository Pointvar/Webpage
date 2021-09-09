import React from "react";
import { Input, Button, Select, Popconfirm, Form } from "antd";
const { Option } = Select;
const { Search } = Input;

import "antd/dist/antd.css";
import "./index.scss";

function TableHeader({
  initialValues,
  form,
  statusMaps,
  platformMaps,
  dataSource,
  selectedKeys,
  onSearchTitle,
  onSearchId,
  onSearchPlatform,
  onSearchStatus,
  onClickRestSearch,
  onClickHideTasks,
}) {
  return (
    <div className="table_header_box">
      <Form initialValues={initialValues} form={form} className="filter_box">
        <Form.Item className="filter_element" label="标题搜索" name="filterTitle">
          <Search placeholder="支持商品标题模糊搜索" allowClear onSearch={onSearchTitle} />
        </Form.Item>
        <Form.Item className="filter_element" label="商品ID搜索" name="filterId">
          <Search placeholder="支持源ID和上货后ID搜索" allowClear style={{ width: 230 }} onSearch={onSearchId} />
        </Form.Item>
        <Form.Item className="filter_element" label="商品来源" name="filterPlatform">
          <Select style={{ width: 84 }} onChange={onSearchPlatform}>
            {platformMaps.map(({ key, value }) => {
              return (
                <Option key={key} value={key}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item className="filter_element" label="上货状态" name="filterStatus">
          <Select style={{ width: 84 }} onChange={onSearchStatus}>
            {statusMaps.map(({ key, value }) => {
              return (
                <Option key={key} value={key}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item className="filter_element">
          <Button className="filter_element" type="primary" onClick={onClickRestSearch}>
            搜索重置
          </Button>
        </Form.Item>
      </Form>

      <div className="operator">
        <div className="operator_info">
          <span>
            已选择:<span className="selectMessage">{selectedKeys.length}</span>条 /
          </span>
          <span> 总记录:{dataSource.length}条</span>
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
  );
}

export default TableHeader;
