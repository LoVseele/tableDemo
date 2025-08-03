import React, { useEffect, useState } from "react";
import { User } from "../types/User";
import { useDispatch, useSelector } from "react-redux";
import "./UserTable.css";
import { Input, Table, Modal, Form, InputNumber, Pagination } from "antd";
import { RootState, AppDispatch } from "../../store/index";
import { fetchUsers } from "../../store/userSlice";

const UserTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  //引入userSlice数据
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  //表格主体部分
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // 每页显示5条数据

  // 列配置
  const columns = [
    { title: "姓名", dataIndex: "name", width: "15%" },
    { title: "年龄", dataIndex: "age", width: "10%" },
    { title: "地址", dataIndex: "address" },
    {
      title: "操作",
      width: "20%",
      render: () => <a>编辑</a>, // 添加操作按钮
    },
  ];

  // 测试数据
  const data: User[] = [
    { id: 1, name: "张三", age: 32, address: "北京市" },
    { id: 2, name: "李四", age: 42, address: "上海市" },
    { id: 3, name: "1", age: 22, address: "Beijing" },
    { id: 4, name: "下半", age: 28, address: "Shanghai" },
    { id: 5, name: "吴俊达", age: 12, address: "收到" },
    { id: 6, name: "是", age: 1, address: "12 " },
  ];

  // 计算当前页数据
  const currentData = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="tableBox">
      <h1>用户信息管理系统</h1>
      <Input.Search className="search" placeholder="搜索用户" />

      <Table
        dataSource={currentData}
        className="table"
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* 独立分页器 */}
      <div className="paginationBox">
        <Pagination
          current={currentPage}
          total={users.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  );
};

export default UserTable;
