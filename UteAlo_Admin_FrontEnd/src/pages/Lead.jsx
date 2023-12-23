import React from "react";
import { Tag, Button, Table, Dropdown } from "antd";

import CrudModule from "@/modules/CrudModule";
import LeadForm from "@/forms/LeadForm";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/serverApiConfig";
import axios from "axios";

function Lead() {
  const entity = "v1/admin/postManager";
  const searchConfig = {
    displayLabels: ["userName"],
    searchFields: "userName,content,postGroupName",
    outputValue: "_id",
  };

  const panelTitle = "Quản lý bài đăng";
  const dataTableTitle = "Danh sách bài đăng";
  const entityDisplayLabels = ["userName"];

  const readColumns = [
    {
      title: "Người đăng",
      dataIndex: "userName",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      render: (roleName) => {
        let color;
        let displayRoleName;
        switch (roleName) {
          case "SinhVien":
            color = "green";
            displayRoleName = "Sinh Viên";
            break;
          case "GiangVien":
            color = "red";
            displayRoleName = "Giảng Viên";
            break;
          case "Admin":
            color = "orange";
            displayRoleName = "Admin";
            break;
          case "PhuHuynh":
            color = "purple";
            displayRoleName = "Phụ Huynh";
            break;
          case "NhanVien":
            color = "grey";
            displayRoleName = "Nhân Viên";
            break;
          default:
            color = "volcano";
            displayRoleName = roleName;
            break;
        }

        return <Tag color={color}>{displayRoleName}</Tag>;
      },
    },

    {
      title: "Nội dung",
      dataIndex: "content",
    },
    {
      title: "Ảnh",
      dataIndex: "photos",
      render: (photos) => {
        if (!photos) {
          return "Không có";
        } else {
          return (
            <img
              src={photos}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        }
      },
    },
    {
      title: "Tệp",
      dataIndex: "files",
      render: (files) => {
        if (!files) {
          return "Không có";
        } else {
          const decodedUrl = decodeURIComponent(files);
          return (
            <a href={decodedUrl} download>
              Tải xuống tệp
            </a>
          );
        }
      },
    },

    {
      title: "Nhóm",
      dataIndex: "postGroupName",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
    },
    {
      title: "Bình luận",
      dataIndex: "comments",
      render: (comments) => {
        return comments.length;
      },
    },
    {
      title: "Lượt thích",
      dataIndex: "likes",
      render: (likes) => {
        return likes.length;
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "postTime",
      render: (postTime) => {
        const date = new Date(postTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "privacyLevel",
      render: (privacyLevel) => {
        switch (privacyLevel) {
          case "PUBLIC":
            return "Công khai";
          case "PRIVATE":
            return "Chỉ mình tôi";
          case "FRIENDS":
            return "Bạn bè";
          case "GROUP_MEMBERS":
            return "Nhóm";
          case "ADMIN":
            return "Hệ thống";
          default:
            return "Không xác định";
        }
      },
    },
  ];
  const dataTableColumns = [
    {
      title: "Người đăng",
      dataIndex: "userName",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      render: (roleName) => {
        let color;
        let displayRoleName;
        switch (roleName) {
          case "SinhVien":
            color = "green";
            displayRoleName = "Sinh Viên";
            break;
          case "GiangVien":
            color = "red";
            displayRoleName = "Giảng Viên";
            break;
          case "Admin":
            color = "orange";
            displayRoleName = "Admin";
            break;
          case "PhuHuynh":
            color = "purple";
            displayRoleName = "Phụ Huynh";
            break;
          case "NhanVien":
            color = "grey";
            displayRoleName = "Nhân Viên";
            break;
          default:
            color = "volcano";
            displayRoleName = roleName;
            break;
        }

        return <Tag color={color}>{displayRoleName}</Tag>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (content) => {
        if (!content) {
          return "Không có";
        }
        return content;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "photos",
      render: (photos) => {
        if (!photos) {
          return "Không có";
        } else {
          return (
            <img
              src={photos}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        }
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "postTime",
      render: (postTime) => {
        const date = new Date(postTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "privacyLevel",
      render: (privacyLevel) => {
        switch (privacyLevel) {
          case "PUBLIC":
            return "Công khai";
          case "PRIVATE":
            return "Chỉ mình tôi";
          case "FRIENDS":
            return "Bạn bè";
          case "GROUP_MEMBERS":
            return "Nhóm";
          case "ADMIN":
            return "Hệ thống";
          default:
            return "Không xác định";
        }
      },
    },
  ];

  const ADD_NEW_ENTITY = "Thêm bài đăng";
  const DATATABLE_TITLE = "Danh sách bài đăng";
  const ENTITY_NAME = "Bài đăng";
  const CREATE_ENTITY = "Tạo bài đăng";
  const UPDATE_ENTITY = "Chỉnh sửa bài đăng";
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

  const [listPostToDay, setListPostToDay] = useState([]);
  const [listPost7Days, setListPost7Days] = useState([]);
  const [listPost1Month, setListPost1Month] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const fetchPostToDay = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/postManager/filterByDate?action=today`
      );
      setListPostToDay(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchPost7Days = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/postManager/filterByDate?action=7days`
      );
      setListPost7Days(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchPost1Month = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/postManager/filterByDate?action=month`
      );
      setListPost1Month(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    fetchPost1Month();
    fetchPost7Days();
    fetchPostToDay();
  }, []);

  console.log("listPostToDay", listPostToDay);
  console.log("listPost7Days", listPost7Days);
  console.log("listPost1Month", listPost1Month);

  const handleTodayClick = () => {
    setSelectedPeriod("today");
  };

  const handle7DaysClick = () => {
    setSelectedPeriod("7days");
  };

  const handle1MonthClick = () => {
    setSelectedPeriod("1month");
  };

  function RecentTable({ ...props }) {
    let { entity, dataTableColumns } = props;
    dataTableColumns = [
      ...dataTableColumns,
    ];

    const asyncList = () => {
      return request.list(entity);
    };

    const { result, isLoading, isSuccess } = useFetch(asyncList);

    const firstFiveItems = () => {
      if (selectedPeriod === "today") {
        return listPostToDay.slice(0, 5);
      } else if (selectedPeriod === "7days") {
        return listPost7Days.slice(0, 5);
      } else if (selectedPeriod === "1month") {
        return listPost1Month.slice(0, 5);
      }
      if (isSuccess && result) {
        return result.slice(0, 5);
      }
      return [];
    };
    return (
      <>
        <Table
          columns={dataTableColumns}
          rowKey={(item) => item._id}
          dataSource={isSuccess && firstFiveItems()}
          pagination={false}
          loading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <CrudModule
        createForm={<LeadForm />}
        updateForm={<LeadForm isUpdateForm={true} />}
        config={config}
      />
      <div className="container" style={{ width: "80%", margin: "auto" }}>
        {" "}
        <div className="whiteBox shadow" style={{ marginBottom: "40px" }}>
          <div className="pad20">
            <h3 style={{ color: "#22075e", marginBottom: 5 }}>Bài viết mới</h3>
            <Button onClick={handleTodayClick}>Trong ngày hôm nay</Button>
            <Button onClick={handle7DaysClick}>Trong 7 ngày</Button>
            <Button onClick={handle1MonthClick}>Trong 1 tháng</Button>
          </div>
          <RecentTable
            entity={"v1/admin/postManager"}
            dataTableColumns={dataTableColumns}
          />
        </div>
      </div>
    </>
  );
}

export default Lead;
