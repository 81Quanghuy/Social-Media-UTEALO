import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";

import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";
import storePersist from "@/redux/storePersist";
import { message } from "antd";

import { getCookie, setCookie, deleteCookie } from "./cookie";

export const login = async (loginAdminData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `v1/auth/login`,
      loginAdminData
    );
    console.log("response", response);
    if (!response.data.result) {
      message.error("Tài khoản không tồn tại");
      errorHandler(error);
    } else if (response.data.result.roleName !== "Admin") {
      message.error("Bạn không có quyền truy cập vào trang web này");
      errorHandler(error);
    } else if (response.data.result) {
      message.success("Đăng nhập thành công");
      token.set(response.data.result.accessToken);
      return successHandler(response);
    }
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = () => {
  token.remove();
  storePersist.clear();
};

export const token = {
  get: () => {
    return getCookie(ACCESS_TOKEN_NAME);
  },
  set: (token) => {
    return setCookie(ACCESS_TOKEN_NAME, token);
  },
  remove: () => {
    return deleteCookie(ACCESS_TOKEN_NAME);
  },
};
