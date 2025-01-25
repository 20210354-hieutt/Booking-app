import React from "react";
import "./DashBoard.css";
import MainDash from "../../component/MainDash/MainDash";
import RightSide from "../../component/RightSide/RightSide";

const DashBoard = () => {
  return (
    <div className="dashboardContent">
      <MainDash />
      <RightSide />
    </div>
  );
};

export default DashBoard;
