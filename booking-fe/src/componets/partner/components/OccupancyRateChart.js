import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  getMonthlyOccupancyRatesByOwner,
  getMonthlyOccupancyRatesByProperty,
} from "../../../api/roomAPI";
Chart.register(...registerables);
const OccupancyRateChart = ({ setTotalOccupancyRate, property, type }) => {
  const userId = localStorage.getItem("userId");
  const [occupancyRate, setOccupancyRate] = useState(new Array(12).fill(0));

  const getOccupancyRate = async () => {
    const occupancyData = new Array(12).fill(0);
    let respone;
    if (type === "property") {
      respone = await getMonthlyOccupancyRatesByProperty(property._id);
    } else {
      respone = await getMonthlyOccupancyRatesByOwner(userId);
    }
    respone.forEach((item) => {
      occupancyData[item.month - 1] = item.occupancyRate;
    });
    setOccupancyRate(occupancyData);
    const totalOccupacyRate = respone.reduce((sum, occupancy) => {
      return sum + occupancy.occupancyRate;
    }, 0);
    setTotalOccupancyRate(totalOccupacyRate);
  };
  useEffect(() => {
    getOccupancyRate();
  }, []);
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Tỷ Lệ Lấp Đầy (%)",
        data: occupancyRate,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Tỷ Lệ Lấp Đầy Phòng Hàng Tháng</h3>
      <Line data={data} />
    </div>
  );
};

export default OccupancyRateChart;
