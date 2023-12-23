// import React, { useEffect, useState } from "react";
// import ReactEcharts from "echarts-for-react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/serverApiConfig";

// const MultiLineChart = () => {
//   const [postsData, setPostsData] = useState([]);
//   const [usersData, setUsersData] = useState([]);
//   const [commentsData, setCommentsData] = useState([]);
//   const [groupsData, setGroupsData] = useState([]);

//   const fetchData = async (type, setData) => {
//     try {
//       const res = await axios.get(getApiUrl(type));
//       setData(formatData(res.data));
//     } catch (error) {
//       console.error(`Error fetching ${type} count:`, error);
//     }
//   };

//   const getApiUrl = (type) => {
//     switch (type) {
//       case "posts":
//         return `${API_BASE_URL}v1/admin/postManager/countPostsByMonthInYear`;
//       case "users":
//         return `${API_BASE_URL}v1/admin/userManager/countUsersByMonthInYear`;
//       case "comments":
//         return `${API_BASE_URL}v1/admin/commentManager/countCommentsByMonthInYear`;
//       case "groups":
//         return `${API_BASE_URL}v1/admin/groupManager/countGroupsByMonthInYear`;
//       default:
//         return "";
//     }
//   };

//   const formatData = (rawData) => {
//     return Object.keys(rawData).map((month, index) => ({
//       month: `Tháng ${index + 1}`,
//       value: rawData[month],
//     }));
//   };

//   useEffect(() => {
//     fetchData("posts", setPostsData);
//     fetchData("users", setUsersData);
//     fetchData("comments", setCommentsData);
//     fetchData("groups", setGroupsData);
//   }, []);

//   const option = {
//     xAxis: {
//       type: "category",
//       data: postsData.map((data) => data.month),
//     },
//     yAxis: {
//       type: "value",
//     },
//     series: [
//       {
//         data: postsData.map((data) => data.value),
//         type: "line",
//         name: "Posts",
//       },
//       {
//         data: usersData.map((data) => data.value),
//         type: "line",
//         name: "Users",
//       },
//       {
//         data: commentsData.map((data) => data.value),
//         type: "line",
//         name: "Comments",
//       },
//       {
//         data: groupsData.map((data) => data.value),
//         type: "line",
//         name: "Groups",
//       },
//     ],
//   };

//   return <ReactEcharts option={option} />;
// };

// export default MultiLineChart;
