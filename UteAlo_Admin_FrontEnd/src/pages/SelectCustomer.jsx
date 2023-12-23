import React from "react";

import CustomCrudModule from "@/modules/CustomCrudModule";
import CustomerForm from "@/forms/CustomerForm";

function SelectCustomer() {
  const entity = "v1/admin/groupManager";
  const searchConfig = {
    displayLabels: ["postGroupName"],
    searchFields: "postGroupName",
    outputValue: "_id",
  };

  const panelTitle = "Quản lý nhóm";
  const dataTableTitle = "Danh sách nhóm";
  const entityDisplayLabels = ["postGroupName"];

  const readColumns = [
    {
      title: "Tên nhóm",
      dataIndex: "postGroupName",
    },
    {
      title: "Ảnh nhóm",
      dataIndex: "avatarGroup",
      render: (avatarGroup) => {
        if (!avatarGroup) {
          return "Không có";
        } else {
          return <img src={avatarGroup} alt="Ảnh" style={{ maxWidth: "100px", maxHeight: "100px" }} />;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "bio",
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "isPublic",
      render: (isPublic) => {
        if(isPublic) {
          return "Công khai";
        }
        return "Riêng tư";
      },
    },
    {
      title: "Số thành viên",
      dataIndex: "countMember",
    },
  ];

  const dataTableColumns = [
    {
      title: "Tên nhóm",
      dataIndex: "postGroupName",
      render: (postGroupName) => {
        if (!postGroupName) {
          return "Không có";
        }
        return postGroupName
      },
    },
    {
      title: "Ảnh nhóm",
      dataIndex: "avatarGroup",
      render: (avatarGroup) => {
        if (!avatarGroup) {
          return "Không có";
        } else {
          return <img src={avatarGroup} alt="Ảnh" style={{ maxWidth: "100px", maxHeight: "100px" }} />;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "bio",
      render: (bio) => {
        if (!bio) {
          return "Không có";
        }
        return bio
      },
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "isPublic",
      render: (isPublic) => {
        if(isPublic) {
          return "Công khai";
        }
        return "Riêng tư";
      },
    },
    {
      title: "Số thành viên",
      dataIndex: "countMember",
      render: (countMember) => {
        if (!countMember) {
          return 0;
        }
        return countMember
      },
    },
  ];
  

  const ADD_NEW_ENTITY = "Add new customer";
  const DATATABLE_TITLE = "customers List";
  const ENTITY_NAME = "customer";
  const CREATE_ENTITY = "Create customer";
  const UPDATE_ENTITY = "Update customer";
  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CustomCrudModule
      createForm={<CustomerForm />}
      updateForm={<CustomerForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default SelectCustomer;
