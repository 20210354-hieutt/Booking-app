import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  getMonthlyRevenue,
  getMonthlyRevenueByProperty,
} from "../../../api/bookingAPI";
Chart.register(...registerables);
const RevenueChart = ({ setTotalRevenue, type, property }) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(new Array(12).fill(0));
  const handleGetMonthlyRevenue = async () => {
    let data;
    if (type === "property") {
      data = await getMonthlyRevenueByProperty(property._id);
    } else {
      const userId = localStorage.getItem("userId");
      data = await getMonthlyRevenue(userId);
      console.log(data)
    }
    const result = await data;
    const revenueData = new Array(12).fill(0);

    if (result.length !== 0) {
      result[0].monthlyRevenues.forEach((item) => {
        revenueData[item.month - 1] = item.revenue;
      });
      setMonthlyRevenue(revenueData);
      setTotalRevenue(result[0].yearlyRevenue);
    } else {
      setMonthlyRevenue([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setTotalRevenue(0);
    }
  };
  useEffect(() => {
    handleGetMonthlyRevenue();
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
        label: "Doanh Thu (VNĐ)",
        data: monthlyRevenue,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Doanh Thu Hàng Tháng</h3>
      <Bar data={data} />
    </div>
  );
};

export default RevenueChart;
