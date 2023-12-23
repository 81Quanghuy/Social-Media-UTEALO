import React from "react";
import { Tag,Button, Table, Dropdown } from "antd";

import CrudModule from "@/modules/CrudModule";
import CommentForm from "@/forms/CommentForm";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { EllipsisOutlined } from "@ant-design/icons";
//import RecentTable from "@/components/RecentTable";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/serverApiConfig";
import axios from "axios";

function Comment() {
  const entity = "v1/admin/commentManager";
  const searchConfig = {
    displayLabels: ["userName"],
    searchFields: "userName",
    outputValue: "_id",
  };

  const panelTitle = "Quản lý bình luận";
  const dataTableTitle = "Danh sách bình luận";
  const entityDisplayLabels = ["userName"];

  const readColumns = [
    {
      title: "Người đăng",
      dataIndex: "userName",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "userAvatar",
      render: (userAvatar) => {
        if (!userAvatar) {
          return "Không có";
        } else {
          return (
            <img
              src={userAvatar}
              alt="Ảnh"
              style={{ maxWidth: "80px", maxHeight: "80px" }}
            />
          );
        }
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
              style={{ maxWidth: "80px", maxHeight: "90px" }}
            />
          );
        }
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createTime",
      render: (postTime) => {
        const date = new Date(postTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Số lượt thích",
      dataIndex: "likes",
      render: (likes) => {
        if (likes != undefined) {
          return <Tag color={"green"}>{likes.length}</Tag>;
        }
        return <Tag color={"red"}>{0}</Tag>;
      },
    },
  ];

  const dataTableColumns = [
    {
      title: "Họ và tên",
      dataIndex: "userName",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "userAvatar",
      render: (userAvatar) => {
        if (!userAvatar) {
          return "Không có";
        } else {
          return (
            <img
              src={userAvatar}
              alt="Ảnh"
              style={{ maxWidth: "80px", maxHeight: "80px" }}
            />
          );
        }
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
              style={{ maxWidth: "80px", maxHeight: "80px" }}
            />
          );
        }
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createTime",
      render: (postTime) => {
        const date = new Date(postTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Số lượt thích",
      dataIndex: "likes",
      render: (likes) => {
        if (likes != undefined) {
          return <Tag color={"green"}>{likes.length}</Tag>;
        }
        return <Tag color={"red"}>{0}</Tag>;
      },
    },
  ];

  const ADD_NEW_ENTITY = "Thêm bình luận mới";
  const DATATABLE_TITLE = "products List";
  const ENTITY_NAME = "product";
  const CREATE_ENTITY = "Create product";
  const UPDATE_ENTITY = "Update product";
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

  const [listCommentToDay, setListCommentToDay] = useState([]);
  const [listComment7Days, setListComment7Days] = useState([]);
  const [listComment1Month, setListComment1Month] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const fetchCommentToDay = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/commentManager/filterByDate?action=today`
      );
      setListCommentToDay(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchComment7Days = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/commentManager/filterByDate?action=7days`
      );
      setListComment7Days(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  const fetchComment1Month = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}v1/admin/commentManager/filterByDate?action=month`
      );
      setListComment1Month(res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    fetchComment1Month();
    fetchComment7Days();
    fetchCommentToDay();
  }, []);

  console.log("listCommentToDay", listCommentToDay);
  console.log("listComment7Days", listComment7Days);
  console.log("listComment1Month", listComment1Month);

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
        return listCommentToDay.slice(0, 5);
      } else if (selectedPeriod === "7days") {
        return listComment7Days.slice(0, 5);
      } else if (selectedPeriod === "1month") {
        return listComment1Month.slice(0, 5);
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
        createForm={<CommentForm />}
        updateForm={<CommentForm isUpdateForm={true} />}
        config={config}
      />
      <div className="container" style={{ width: "80%", margin: "auto" }}>
        {" "}
        <div className="whiteBox shadow" style={{ marginBottom: "40px" }}>
          <div className="pad20">
            <h3 style={{ color: "#22075e", marginBottom: 5 }}>Bình luận mới</h3>
            <Button onClick={handleTodayClick}>Trong ngày hôm nay</Button>
            <Button onClick={handle7DaysClick}>Trong 7 ngày</Button>
            <Button onClick={handle1MonthClick}>Trong 1 tháng</Button>
          </div>
          <RecentTable
            entity={"v1/admin/commentManager"}
            dataTableColumns={dataTableColumns}
          />
        </div>
      </div>
    </>
  );
}

export default Comment;
