import React, { useState, useEffect } from "react";
import "./writeReview.css";
import { createReview } from "../../../api/reviewAPI";
import SuccessfullyDisplay from "../../successfullyDisplay/successfullyDisplay";
import FailedDisplay from "../../failedDisplay/failedDisplay";
import { faI } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function WriteReview({ rooms, refreshReviewSection }) {
  // Define TYPE enum inside the function
  const TYPE = {
    STAFF: "Staff",
    FACILITIES: "Facilities",
    CLEANLINESS: "Cleanliness",
    COMFORT: "Comfort",
    VALUE_OF_MONEY: "Value of money",
    LOCATION: "Location",
    FREE_WIFI: "Free wifi",
  };
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState(null); // This will be set based on room selection
  const [rating, setRating] = useState(1); // Default to 1 star
  const [reviewText, setReviewText] = useState("");
  const [reviewType, setReviewType] = useState(TYPE.STAFF); // Default review type
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [succesfullyPopUp, setSuccessfullyPopUp] = useState(false);
  const [failedPopUp, setFailedPopUp] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    // Get userId from sessionStorage
    const user = localStorage.getItem("userId");
    console.log(rooms);
    if (user) {
      setUserId(user);
    }
    if (rooms && rooms.length > 0) {
      console.log(rooms);

      setRoomId(rooms[0].room._id); // Default to first roomId if available
    }

    return () => {
      setIsSubmitting(false);
      setSuccessfullyPopUp(false);
      setFailedPopUp(false);
    };
  }, [rooms]);

  const handleTimeoutSuccessfullyDisplay = async () => {
    setSuccessfullyPopUp(true);
  };

  const handleTimeoutFailedDisplay = async () => {
    setFailedPopUp(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewData = {
      userId,
      roomId,
      rating,
      review_text: reviewText,
      review_type: reviewType,
    };

    try {
      const accessToken = localStorage.getItem('accessToken')

      await createReview(reviewData, accessToken);

      console.log("Review submitted:", reviewData);

      await handleTimeoutSuccessfullyDisplay();

      refreshReviewSection();
    } catch (e) {
      if(e.status === 401){
        setShowModal(true)
      }else {
      await handleTimeoutFailedDisplay();

      }
    } finally {
    }

    setIsSubmitting(false);
  };
  const handleCloseModal = async () => {
    setShowModal(false);
    navigate("/login");
  };
  return (
    <div className="writeReview-section">
      <h2 className="writeReview-title">Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="writeReview-form-group">
          <label className="writeReview-label">Rating:</label>
          <div className="writeReview-rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`writeReview-star ${star <= rating ? "writeReview-filled" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="writeReview-form-group">
          <label className="writeReview-label">Room:</label>
          <select
            className="writeReview-select"
            value={roomId}
            onChange={(e) => {
              e.preventDefault();
              setRoomId(e.target.value);
            }}
          >
            {rooms.map((r) => (
              <option key={r.room._id} value={r.room._id}>
                {r.room.name}
              </option>
            ))}
          </select>
        </div>

        <div className="writeReview-form-group">
          <label className="writeReview-label">Review Type:</label>
          <select
            className="writeReview-select"
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
          >
            {Object.values(TYPE).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="writeReview-form-group">
          <label className="writeReview-label">Review Text:</label>
          <textarea
            className="writeReview-textarea"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
          />
        </div>

        <button
          className="writeReview-submit-btn"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="fix-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign in required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You must sign in to write your review!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleCloseModal()}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {succesfullyPopUp && (
        <SuccessfullyDisplay
          text={"Tạo đánh giá thành công!"}
          isOpen={succesfullyPopUp}
          setIsOpen={setSuccessfullyPopUp}
        />
      )}
      {failedPopUp && (
        <FailedDisplay
          text={"Vui lòng điền đầy đủ thông tin"}
          isOpen={failedPopUp}
          setIsOpen={setFailedPopUp}
        />
      )}
    </div>
  );
}

export default WriteReview;
