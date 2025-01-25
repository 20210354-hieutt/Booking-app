import React, { useEffect, useState } from "react";
import "./DashboardPage.css";
import OccupancyRateChart from "../components/OccupancyRateChart";
import RevenueChart from "../components/RevenueChart";
import AverageRatingChart from "../components/AverageRatingChart";

const DashboardPage = ({ type, property }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  return (
    <div className="dashboard">
      <div className="dashboard-summary">
        <div className="summary-item">
          <h3>Tổng Doanh Thu</h3>
          <p>{totalRevenue.toLocaleString("vi-VN")} VNĐ</p>
        </div>
        <div className="summary-item">
          <h3>Tỷ Lệ Lấp Đầy Phòng</h3>
          <p>{occupancyRate}%</p>
        </div>
        <div className="summary-item">
          <h3>Đánh Giá Trung Bình</h3>
          <p>{averageRating}/5</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <RevenueChart
          setTotalRevenue={setTotalRevenue}
          type={type}
          property={property}
        />
        <OccupancyRateChart
          setTotalOccupancyRate={setOccupancyRate}
          type={type}
          property={property}
        />
        <AverageRatingChart
          setAverageRating={setAverageRating}
          type={type}
          property={property}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
