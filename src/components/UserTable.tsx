import React, { useEffect, useState } from "react";
import { User } from "../types/User";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Pagination,
} from "antd";
import { RootState, AppDispatch } from "../../store/index";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../store/userSlice";
import "./UserTable.css";

//表格界面
const UserTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  //引入userSlice数据
  const { users, loading } = useSelector((state: RootState) => state.users);

  // 判断增加用户框是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 编辑用户
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 添加表单实例
  const [form] = Form.useForm();

  // 添加搜索内容
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    form.setFieldsValue(user);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        dispatch(updateUser({ ...editingUser, ...values }));
      } else {
        dispatch(addUser(values));
      }
      setIsModalOpen(false);
    } catch {
      setIsModalOpen(true);
    }
  };

  //表格主体部分
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // 列配置
  const columns = [
    { title: "姓名", dataIndex: "name", width: "15%" },
    { title: "年龄", dataIndex: "age", width: "10%" },
    { title: "地址", dataIndex: "address" },
    {
      title: "操作",
      width: "20%",
      render: (_: any, record: User) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  /* 计算当前页数据  */
  function getCurrentData(searchValue: string) {
    if (searchValue) {
      return users.filter((user) => user.name.includes(searchValue));
    } else {
      return users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }
  }

  let currentData = getCurrentData(searchValue);
  // 筛选目标用户
  const filteredUsers = users.filter((user) => user.name.includes(searchValue));

  return (
    <div className="tableBox">
      <h1>用户信息管理系统</h1>
      <div className="searchBox">
        <Input.Search
          size="large"
          className="search"
          placeholder="请输入用户名"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(value) => {
            handleSearch(value);
          }}
        />
        <Button type="primary" onClick={handleAdd}>
          添加用户
        </Button>
      </div>
      <Table
        dataSource={currentData}
        className="table"
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      {/* 计算当前页数据 */}
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
      {/* 添加用户区 */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: "请输入姓名" },
              {
                type: "string",
                message: "请输入正确的姓名",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[
              { required: true, message: "请输入年龄" },
              {
                type: "number",
                message: "年龄必须是数字",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;
