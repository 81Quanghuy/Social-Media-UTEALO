import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";
import axios from "axios";
import { API_BASE_URL } from "@/config/serverApiConfig";

const LineChart = ({ dataType }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${getApiUrl(dataType)}`);
        setData(formatData(res.data));
      } catch (error) {
        console.error(`Error fetching ${dataType} count:`, error);
      }
    };
    fetchData();
  }, [dataType]);

  const getApiUrl = (type) => {
    switch (type) {
      case "posts":
        return `${API_BASE_URL}v1/admin/postManager/countPostsByMonthInYear`;
      case "users":
        return `${API_BASE_URL}v1/admin/userManager/countUsersByMonthInYear`;
      case "comments":
        return `${API_BASE_URL}v1/admin/commentManager/countCommentsByMonthInYear`;
      case "groups":
        return `${API_BASE_URL}v1/admin/groupManager/countGroupsByMonthInYear`;
      default:
        return "";
    }
  };

  const formatData = (rawData) => {
    return Object.keys(rawData).map((month, index) => ({
      month: `Tháng ${index + 1}`,
      value: rawData[month],
      type: dataType,
    }));
  };

  const config = {
    data,
    xField: "month",
    yField: "value",
    color:
      dataType == "posts"
        ? "#6bab4c"
        : dataType == "users"
        ? "#ffa940"
        : dataType == "comments"
        ? "#13c2c2"
        : "#fac",
    meta: {
      month: { alias: "Tháng" },
      value: { alias: "Số lượng" },
    },
    label: {
      formatter: (v) => {
        if (!isNaN(v) && isFinite(v)) {
          return `${parseFloat(v).toFixed(2)}K`;
        }
        return "";
      },
    },
    xAxis: {
      label: {
        style: {
          fill:
            dataType == "posts"
              ? "#6bab4c"
              : dataType == "users"
              ? "#ffa940"
              : dataType == "comments"
              ? "#13c2c2"
              : "#fac",
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill:
            dataType == "posts"
              ? "#6bab4c"
              : dataType == "users"
              ? "#ffa940"
              : dataType == "comments"
              ? "#13c2c2"
              : "#fac",
          fontWeight: "bold",
        },
      },
    },
    lineStyle: { lineWidth: 4 },
  };

  return (
    <div>
      <Line {...config} />
    </div>
  );
};

export default LineChart;