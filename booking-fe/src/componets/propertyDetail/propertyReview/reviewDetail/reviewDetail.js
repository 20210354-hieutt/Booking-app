import React from "react";
import "./reviewDetail.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReviewDetail = ({ review }) => {
  return (
    <>
      <div className="review-detail">
        <div className="review-detail-profile">
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
                  {review?.userId?.address?.province || (
                    <Skeleton width="100%" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="review-detail-content">
          <div className="review-detail-overview">
            <div className="review-detail-header">
              <div className="review-detail-title">
                <p>
                  <b>{review?.review_type || <Skeleton width="100%" />}</b>
                </p>
              </div>
            </div>
            <div className="review-detail-rate">
              <p>
                <b>{review?.rating || <Skeleton width="100%" />}</b>
              </p>
            </div>
          </div>

          <div className="review-detail-text">
            <p>{review?.review_text || <Skeleton width="100%" count={5} />}</p>
          </div>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default ReviewDetail;
