import React, { useEffect, useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";
import { API_BASE_URL } from "@/config/serverApiConfig";

const colors = ["red", "pink","orange","yellow","green","blue","purple","brown","black","gray","white","cyan"];

const CustomShapeBarChart = ({ dataType }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(getApiUrl(dataType));
        const formattedData = formatData(res.data);
        setData(formattedData);
      } catch (error) {
        console.error(`Error fetching ${dataType} data:`, error);
      }
    };
    fetchData();
  }, [dataType]);

  const formatData = (rawData) => {
    return Object.entries(rawData).map(([month, value]) => ({
      name: month,
      uv: value,
    }));
  };

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

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <BarChart
    style={{backgroundColor:'#000'}}
      width={500}
      height={300}
      data={data} // Dữ liệu từ state được sử dụng ở đây
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar
        dataKey="uv"
        fill="#8884d8"
        shape={<TriangleBar />}
        label={{ position: "top" }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default CustomShapeBarChart;
