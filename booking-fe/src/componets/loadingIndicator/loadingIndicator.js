import React from "react";
import "./loadingIndicator.css";
import { OrbitProgress } from "react-loading-indicators";

const LoadingIndicator = () => {
  return (
    <div className="loadingIndicator">
      <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
    </div>
  );
};

export default LoadingIndicator;
