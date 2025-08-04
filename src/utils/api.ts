import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../src/types/User";

// 增删改查函数
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get<User[]>("http://localhost:8001/users");
  return res.data;
});

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user: Omit<User, "id">) => {
    const res = await axios.post<User>("http://localhost:8001/users", user);
    return res.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user: User) => {
    const res = await axios.put<User>(
      `http://localhost:8001/users/${user.id}`,
      user
    );
    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await axios.delete(`http://localhost:8001/users/${id}`);
    return id;
  }
);
