import React from "react";
import "./reviewPopUp.css";
import ReviewDetail from "../../reviewDetail/reviewDetail";

function ReviewPopUp({ review }) {
  return (
    <>
      <div className="reviewPopUp-container">
        <ReviewDetail review={review} />
      </div>
    </>
  );
}

export default ReviewPopUp;
