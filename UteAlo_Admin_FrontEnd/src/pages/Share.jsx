import React from "react";
import { Tag, Button, Table, Dropdown } from "antd";

import CrudModule from "@/modules/CrudModule";
import ShareForm from "@/forms/ShareForm";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { EllipsisOutlined } from "@ant-design/icons";
//import RecentTable from "@/components/RecentTable";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/serverApiConfig";
import axios from "axios";

function Share() {
  const entity = "v1/admin/shareManager";
  const searchConfig = {
    displayLabels: ["userName"],
    searchFields: "userName,content,postGroupName",
    outputValue: "_id",
  };

  const panelTitle = "Quản lý bài chia sẻ";
  const dataTableTitle = "Danh sách bài chia sẻ";
  const entityDisplayLabels = ["userName"];

  const readColumns = [
    {
      title: "Người chia sẻ",
      dataIndex: "userName",
    },
    {
      title: "Ảnh",
      dataIndex: "avatarUser",
      render: (avatarUser) => {
        if (!avatarUser) {
          return "Không có";
        } else {
          return (
            <img
              src={avatarUser}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        }
      },
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
      title: "Nhóm",
      dataIndex: "postGroupName",
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
      title: "Ngày chia sẻ",
      dataIndex: "createAt",
      render: (createAt) => {
        const date = new Date(createAt);
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
      title: "Người chia sẻ",
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
      dataIndex: "avatarUser",
      render: (avatarUser) => {
        if (!avatarUser) {
          return "Không có";
        } else {
          return (
            <img
              src={avatarUser}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        }
      },
    },
    {
      title: "Ngày chia sẻ",
      dataIndex: "createAt",
      render: (createAt) => {
        const date = new Date(createAt);
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

  const ADD_NEW_ENTITY = "Thêm bài chia sẻ";
  const DATATABLE_TITLE = "Danh sách bài chia sẻ";
  const ENTITY_NAME = "Bài chia sẻ";
  const CREATE_ENTITY = "Tạo bài chia sẻ";
  const UPDATE_ENTITY = "Chỉnh sửa bài chia sẻ";
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

  const [listShareToDay, setListShareToDay] = useState([]);
  const [listShare7Days, setListShare7Days] = useState([]);
  const [listShare1Month, setListShare1Month] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const fetchShareToDay = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/shareManager/filterByDate?action=today`
      );
      setListShareToDay(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchShare7Days = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/shareManager/filterByDate?action=7days`
      );
      setListShare7Days(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchShare1Month = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/shareManager/filterByDate?action=month`
      );
      setListShare1Month(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    fetchShare1Month();
    fetchShare7Days();
    fetchShareToDay();
  }, []);

  console.log("listShareToDay", listShareToDay);
  console.log("listShare7Days", listShare7Days);
  console.log("listShare1Month", listShare1Month);

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
        return listShareToDay.slice(0, 5);
      } else if (selectedPeriod === "7days") {
        return listShare7Days.slice(0, 5);
      } else if (selectedPeriod === "1month") {
        return listShare1Month.slice(0, 5);
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
        // createForm={<ShareForm />}
        // updateForm={<ShareForm isUpdateForm={true} />}
        config={config}
      />
      <div className="container" style={{ width: "80%", margin: "auto" }}>
        {" "}
        <div className="whiteBox shadow" style={{ marginBottom: "40px" }}>
          <div className="pad20">
            <h3 style={{ color: "#22075e", marginBottom: 5 }}>
              Người dùng mới
            </h3>
            <Button onClick={handleTodayClick}>Trong ngày hôm nay</Button>
            <Button onClick={handle7DaysClick}>Trong 7 ngày</Button>
            <Button onClick={handle1MonthClick}>Trong 1 tháng</Button>
          </div>
          <RecentTable
            entity={"v1/admin/shareManager"}
            dataTableColumns={dataTableColumns}
          />
        </div>
      </div>
    </>
  );
}

export default Share;
