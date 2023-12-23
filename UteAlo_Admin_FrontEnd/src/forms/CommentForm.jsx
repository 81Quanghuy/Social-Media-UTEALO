import React from "react";
import { Form, Input } from "antd";

export default function ProductForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Nội dung"
        name="content"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const photosValue = getFieldValue("photos");
              if (!value && !photosValue) {
                return Promise.reject(
                  new Error("Xin hãy nhập nội dung hoặc chọn ảnh!")
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Ảnh"
        name="photos"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const contentValue = getFieldValue("content");
              if (!value && !contentValue) {
                return Promise.reject(
                  new Error("Xin hãy nhập nội dung hoặc chọn ảnh!")
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mã bài đăng"
        name="posId"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn bài đăng để bình luận!",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
