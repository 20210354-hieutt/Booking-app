import React, { useState } from "react";
import "./reviewComment.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReviewPopUp from "./reviewPopUp/reviewPopUp";
import "react-loading-skeleton/dist/skeleton.css";

const ReviewComment = ({ review }) => {
  const [isReviewPopUp, setIsReviewPopUp] = useState(false);

  const handleMoreInfoButton = (e) => {
    e.preventDefault();
    setIsReviewPopUp(true);
  };
  return (
    <div className="reviewComment-container">
      <div className="reviewer-profile">
        <div className="reviewer-image">
          <div className="img">
            <img
              src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
              alt="User Profile"
              class="profile-image"
            />
          </div>
        </div>
        <div className="reviewer-name-nationality">
          <div className="reviewer-name">
            <p>{review?.userId?.userName || <Skeleton width="100%" />}</p>
          </div>
          <div className="reviewer-nationality">
            <p>
              {review?.userId?.address?.province || <Skeleton width="100%" />}
            </p>
          </div>
        </div>
      </div>
      <div className="reviewer-comment">
        <p>{review?.review_text || <Skeleton count={3} />}</p>
        <button onClick={(e) => handleMoreInfoButton(e)}>Tìm hiểu thêm</button>
      </div>

      <div>
        {isReviewPopUp && (
          <>
            <div
              className="blockInput"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsReviewPopUp(false);
              }}
            ></div>
            <ReviewPopUp review={review} />
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewComment;
