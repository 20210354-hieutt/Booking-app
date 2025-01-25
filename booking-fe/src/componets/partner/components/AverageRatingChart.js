import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  getMonthlyRate,
  getMonthlyRateByProperty,
} from "../../../api/reviewAPI";
Chart.register(...registerables);
const AverageRatingChart = ({ setAverageRating, type, property }) => {
  const userId = localStorage.getItem("userId");
  const [rate, setRate] = useState(new Array(5).fill(0));
  useEffect(() => {
    const handleGetMonthlyRate = async () => {
      let respone;

      if (type === "property") {
        respone = await getMonthlyRateByProperty(property._id);
      } else {
        respone = await getMonthlyRate(userId);
      }
      const ratingArray = Object.values(respone);
      const totalRating = Object.entries(respone).reduce(
        (sum, [rating, count]) => {
          return sum + Number(rating) * count;
        },
        0,
      );
      const totalCount = Object.values(respone).reduce(
        (sum, count) => sum + count,
        0,
      );

      const averageRating =
        totalCount === 0 ? 0 : (totalRating / totalCount).toFixed(1);
      setRate(ratingArray);
      setAverageRating(averageRating);
    };
    handleGetMonthlyRate();
  }, []);
  const data = {
    labels: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"],
    datasets: [
      {
        data: rate,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Đánh Giá Trung Bình</h3>
      <Pie data={data} />
    </div>
  );
};

export default AverageRatingChart;
