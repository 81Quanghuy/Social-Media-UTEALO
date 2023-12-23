import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Space,
  Divider,
  Row,
  Col,
  Button,
} from "antd";

import { Layout, Breadcrumb, Statistic, Progress, Tag, DatePicker } from "antd";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import { DashboardLayout } from "@/layout";
import RecentTable from "@/components/RecentTable";

import CustomShapeBarChart from "@/components/Chart/CustomShapeBarChart";
import TopThree from "./TopThree";
import axios from "axios";
import { API_BASE_URL } from "@/config/serverApiConfig";

const TopCard = ({ title, tagContent, tagColor, prefix }) => {
  return (
    <Col className="gutter-row" span={6}>
      <div
        className="whiteBox shadow"
        style={{ color: "#fff", fontSize: 13,fontWeight:'600', height: "106px",backgroundColor:'rgb(29 165 122)' }}
      >
        <div
          className="pad15 strong"
          style={{ textAlign: "center", justifyContent: "center",backgroundColor:'rgb(162 211 196)' }}
        >
          <h3 style={{ color: "#22075e", marginBottom: 0 }}>{title}</h3>
        </div>
        <Divider style={{ padding: 0, margin: 0 }}></Divider>
        <div className="pad15">
          <Row gutter={[0, 0]}>
            <Col className="gutter-row" span={11} style={{ textAlign: "left" }}>
              <div className="left">{prefix}</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <Divider
                style={{ padding: "10px 0", justifyContent: "center" }}
                type="vertical"
              ></Divider>
            </Col>
            <Col
              className="gutter-row"
              span={11}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag
                color={tagColor}
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                {tagContent}
              </Tag>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};
const PreviewState = ({ tag, color, value }) => {
  let colorCode = "#000";
  switch (color) {
    case "bleu":
      colorCode = "#1890ff";
      break;
    case "green":
      colorCode = "#95de64";
      break;
    case "red":
      colorCode = "#ff4d4f";
      break;
    case "orange":
      colorCode = "#ffa940";
      break;
    case "purple":
      colorCode = "#722ed1";
      break;
    case "grey":
      colorCode = "#595959";
      break;
    case "cyan":
      colorCode = "#13c2c2";
      break;
    case "brown":
      colorCode = "#614700";
      break;
    default:
      break;
  }
  return (
    <div style={{ color: "#595959", marginBottom: 5 }}>
      <div className="left alignLeft">{tag}</div>
      <div className="right alignRight">{value}</div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          "0%": colorCode,
          "100%": colorCode,
        }}
      />
    </div>
  );
};
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}v1/admin/postManager/countPost`
        );
        setPostData(res.data);
      } catch (error) {
        console.error(`Error fetching count:`, error);
      }
    };
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}v1/admin/userManager/countUser`
        );
        setUserData(res.data);
      } catch (error) {
        console.error(`Error fetching count:`, error);
      }
    };
    const fetchGroupData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}v1/admin/groupManager/countGroup`
        );
        setGroupData(res.data);
      } catch (error) {
        console.error(`Error fetching count:`, error);
      }
    };
    const fetchCommentData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}v1/admin/commentManager/countComment`
        );
        setCommentData(res.data);
      } catch (error) {
        console.error(`Error fetching count:`, error);
      }
    };
    fetchCommentData();
    fetchGroupData();
    fetchUserData();
    fetchPostData();
  }, []);

  const [postColumns, setPostColumns] = useState([
    {
      title: "Người đăng",
      dataIndex: "userName",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      render: (roleName) => {
        let color;
        switch (roleName) {
          case "SinhVien":
            color = "green";
            break;
          case "GiangVien":
            color = "red";
            break;
          case "Admin":
            color = "orange";
            break;
          case "PhuHuynh":
            color = "purple";
            break;
          case "NhanVien":
            color = "grey";
            break;
          default:
            color = "volcano";
            break;
        }

        return <Tag color={color}>{roleName.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (content, record) => {
        if (content) {
          return content;
        } else if (record.photos) {
          return (
            <img
              src={record.photos}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        } else if (record.files) {
          const decodedUrl = decodeURIComponent(record.files);
          return (
            <a href={decodedUrl} download>
              Tải xuống tệp
            </a>
          );
        } else {
          return "Không có";
        }
      },
    },
  ]);

  const userColumns = [
    {
      title: "Họ và tên",
      dataIndex: "userName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dayOfBirth",
      render: (dayOfBirth) => {
        const date = new Date(dayOfBirth);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender) => {
        if (!gender) {
          return "Không có";
        }
        return gender;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      // Sử dụng Tag của Ant Design và CSS để thêm màu sắc
      render: (text, record) => ({
        children: (
          <Tag color={text === "Bị khóa" ? "red" : "green"}>{text}</Tag>
        ),
      }),
    },
  ];

  const shareColumns = [
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
  ];

  const commentColumns = [
    {
      title: "Người đăng",
      dataIndex: "userName",
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
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (content, record) => {
        if (content) {
          return content;
        } else if (record.photos) {
          return (
            <img
              src={record.photos}
              alt="Ảnh"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        } else if (record.files) {
          const decodedUrl = decodeURIComponent(record.files);
          return (
            <a href={decodedUrl} download>
              Tải xuống tệp
            </a>
          );
        } else {
          return "Không có";
        }
      },
    },
  ];

  return (
    <DashboardLayout style={{backgroundColor:'#dde4ee'}}>
      <Row gutter={[24, 24]}>
        <TopCard
          title={"Người dùng"}
          tagColor={"cyan"}
          prefix={"Năm nay"}
          tagContent={userData.countIn1Year}
        />
        <TopCard
          title={"Bài viết"}
          tagColor={"purple"}
          prefix={"Năm nay"}
          tagContent={postData.countIn1Year}
        />
        <TopCard
          title={"Bình luận"}
          tagColor={"green"}
          prefix={"Năm nay"}
          tagContent={commentData.countIn1Year}
        />
        <TopCard
          title={"Nhóm"}
          tagColor={"red"}
          prefix={"Năm nay"}
          tagContent={groupData.countIn1Year}
        />
      </Row>
      <TopThree />
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={18}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
            <Row className="pad10" gutter={[0, 0]}>
              <Col className="gutter-row" span={8}>
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>
                    Người dùng
                  </h3>
                  <PreviewState
                    tag={"Hôm nay"}
                    color={"grey"}
                    value={userData.countToday}
                  />
                  <PreviewState
                    tag={"Trong 1 tuần"}
                    color={"bleu"}
                    value={userData.countInWeek}
                  />
                  <PreviewState
                    tag={"Trong 1 tháng"}
                    color={"orange"}
                    value={userData.countIn1Month}
                  />
                  <PreviewState
                    tag={"Trong 3 tháng"}
                    color={"red"}
                    value={userData.countIn3Month}
                  />
                  <PreviewState
                    tag={"Trong 6 tháng"}
                    color={"cyan"}
                    value={userData.countIn6Month}
                  />
                  <PreviewState
                    tag={"Trong 9 tháng"}
                    color={"green"}
                    value={userData.countIn9Month}
                  />
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                {" "}
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>
                    Bài viết
                  </h3>
                  <PreviewState
                    tag={"Hôm nay"}
                    color={"grey"}
                    value={postData.countToday}
                  />
                  <PreviewState
                    tag={"Trong 1 tuần"}
                    color={"bleu"}
                    value={postData.countInWeek}
                  />
                  <PreviewState
                    tag={"Trong 1 tháng"}
                    color={"orange"}
                    value={postData.countIn1Month}
                  />
                  <PreviewState
                    tag={"Trong 3 tháng"}
                    color={"red"}
                    value={postData.countIn3Month}
                  />
                  <PreviewState
                    tag={"Trong 6 tháng"}
                    color={"cyan"}
                    value={postData.countIn6Month}
                  />
                  <PreviewState
                    tag={"Trong 9 tháng"}
                    color={"green"}
                    value={postData.countIn9Month}
                  />
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                {" "}
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>Nhóm</h3>
                  <PreviewState
                    tag={"Hôm nay"}
                    color={"grey"}
                    value={groupData.countToday}
                  />
                  <PreviewState
                    tag={"Trong 1 tuần"}
                    color={"bleu"}
                    value={groupData.countInWeek}
                  />
                  <PreviewState
                    tag={"Trong 1 tháng"}
                    color={"orange"}
                    value={groupData.countIn1Month}
                  />
                  <PreviewState
                    tag={"Trong 3 tháng"}
                    color={"red"}
                    value={groupData.countIn3Month}
                  />
                  <PreviewState
                    tag={"Trong 6 tháng"}
                    color={"cyan"}
                    value={groupData.countIn6Month}
                  />
                  <PreviewState
                    tag={"Trong 9 tháng"}
                    color={"green"}
                    value={groupData.countIn9Month}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
            <div
              className="pad20"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <h3 style={{ color: "#22075e", marginBottom: 30 }}>Người dùng</h3>

              <Progress
                type="dashboard"
                percent={userData.percentNewUser && userData.percentNewUser.toFixed(2)}
                width={148}
              />
              <p>Người dùng mới trong tháng này</p>
              <Divider />
              <Statistic
                title="Người dùng đang hoạt động"
                value={userData.percentUserOnline}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          {" "}
          <div
            className="space30"
            style={{ display: "flex", marginBottom: "20px", marginTop: "40px" }}
          >
            <Tag
              color="#ffa940"
              style={{
                margin: "auto",
                fontSize: "20px",
                fontWeight: "600",
                height: "40px",
                lineHeight: "40px",
              }}
            >
              Thống kê người dùng trong 12 tháng
            </Tag>
          </div>
          <CustomShapeBarChart dataType="users"/>
        </Col>
        <Col className="gutter-row" span={12}>
          {" "}
          <div
            className="space30"
            style={{ display: "flex", marginBottom: "20px", marginTop: "40px" }}
          >
            <Tag
              color="#6bab4c"
              style={{
                margin: "auto",
                fontSize: "20px",
                fontWeight: "600",
                height: "40px",
                lineHeight: "40px",
              }}
            >
              Thống kê bài viết trong 12 tháng
            </Tag>
          </div>
          <CustomShapeBarChart dataType="posts" />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          {" "}
          <div
            className="space30"
            style={{ display: "flex", marginBottom: "20px", marginTop: "40px" }}
          >
            <Tag
              color="#13c2c2"
              style={{
                margin: "auto",
                fontSize: "20px",
                fontWeight: "600",
                height: "40px",
                lineHeight: "40px",
              }}
            >
              Thống kê bình luận trong 12 tháng
            </Tag>
          </div>
          <CustomShapeBarChart dataType="comments" />
        </Col>
        <Col className="gutter-row" span={12}>
          {" "}
          <div
            className="space30"
            style={{ display: "flex", marginBottom: "20px", marginTop: "40px" }}
          >
            <Tag
              color="#fac"
              style={{
                margin: "auto",
                fontSize: "20px",
                fontWeight: "600",
                height: "40px",
                lineHeight: "40px",
              }}
            >
              Thống kê nhóm trong 12 tháng
            </Tag>
          </div>
          <CustomShapeBarChart dataType="groups"/>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Bài viết mới
              </h3>
            </div>

            <RecentTable
              entity={"v1/admin/postManager"}
              dataTableColumns={postColumns}
            />
          </div>
        </Col>

        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Bình luận mới
              </h3>
            </div>
            <RecentTable
              entity={"v1/admin/commentManager"}
              dataTableColumns={commentColumns}
            />
          </div>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Bài chia sẻ mới
              </h3>
            </div>

            <RecentTable
              entity={"v1/admin/shareManager"}
              dataTableColumns={shareColumns}
            />
          </div>
        </Col>

        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Người dùng mới
              </h3>
            </div>
            <RecentTable
              entity={"v1/admin/userManager"}
              dataTableColumns={userColumns}
            />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
