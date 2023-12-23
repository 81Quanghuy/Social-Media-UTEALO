import React from "react";
import { Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import vietnamProvinces from "../../src/utils/vietnamProvinces.json";

export default function ShareForm({ isUpdateForm = false }) {
  const { Option } = Select;
  return (
    <>
      <Form.Item label="Vị trí" name="location">
        <Select placeholder="Chọn địa điểm">
          {vietnamProvinces.map((location) => (
            <Option key={location.id} value={location.id}>
              {location.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label="Nội dung"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const filesValue = getFieldValue("files");
              const photosValue = getFieldValue("photos");
              if (!value && !filesValue && !photosValue) {
                return Promise.reject(
                  new Error(
                    "Xin hãy nhập nội dung hoặc chọn ít nhất một trường khác!"
                  )
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
        name="files"
        label="Tệp"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          return Array.isArray(e) ? e : e && e.fileList;
        }}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const contentValue = getFieldValue("content");
              const photosValue = getFieldValue("photos");
              if (!contentValue && !photosValue && !value) {
                return Promise.reject(
                  new Error("Xin hãy chọn tệp hoặc chọn ít nhất một trường!")
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Upload name="logo" action="/upload.do" listType="text">
          <Button disabled icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Hình ảnh"
        name="photos"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList;
        }}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const contentValue = getFieldValue("content");
              const filesValue = getFieldValue("files");
              if (!contentValue && !filesValue && !value) {
                return Promise.reject(
                  new Error(
                    "Xin hãy chọn hình ảnh hoặc chọn ít nhất một trường!"
                  )
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Upload
          name="photos"
          listType="picture"
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              message.error("Chỉ có thể tải lên các tệp JPG/PNG!");
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
        >
          <Button disabled icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>
    </>
  );
}
