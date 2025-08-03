// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

//获取userStore的状态类型
export type RootState = ReturnType<typeof store.getState>;

//获取store的dispatch方法的类型
export type AppDispatch = typeof store.dispatch;
