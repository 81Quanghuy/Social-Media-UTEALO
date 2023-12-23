import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import { API_BASE_URL } from "@/config/serverApiConfig";
import axios from "axios";

export default function GroupForm({ isUpdateForm = false }) {
  const { Option } = Select;

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}v1/admin/userManager/listUsers`
        );
        setUserList(res.data);
      } catch (error) {
        // Xử lý lỗi khi gọi API không thành công
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();
  }, []);

  console.log("userList", userList);

  return (
    <>
      <Form.Item
        name="postGroupName"
        label="Tên nhóm"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên nhóm!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Mô tả"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mô tả về nhóm!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item label="Thành viên" name="userId">
        <Select placeholder="Chọn thành viên">
          {userList.map((user) => (
            <Option key={user.userId} value={user.userId}>
              {user.userName}
            </Option>
          ))}
        </Select>
      </Form.Item> */}

      <Form.Item
        label="Thành viên"
        name="userId"
        rules={[
          { required: true, message: "Vui lòng chọn ít nhất một thành viên." },
        ]}
      >
        <Select
          showSearch
          mode="multiple"
          placeholder="Thêm thành viên"
          options={userList.map((user) => ({
            label: (
              <>
                <p>{user.userName}</p>
              </>
            ),
            value: user.userId,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="isPublic"
        label="Quyền riêng tư"
        rules={[
          {
            required: true,
            message: "Xin hãy chọn quyền riêng tư!",
          },
        ]}
      >
        <Select>
          <Option value={true}>Công khai</Option>
          <Option value={false}>Riêng tư</Option>
        </Select>
      </Form.Item>
    </>
  );
}
