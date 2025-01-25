import React from "react";
import "./propertyReview.css";
import { useEffect, useState, useRef } from "react";
import RatingProgressBar from "./ratingProgressBar/ratingProgressBar";
import ReviewComment from "./reviewComment/reviewComment";
import ReviewDetail from "./reviewDetail/reviewDetail";
import {
  findReviewWithProperty,
  getMonthlyRateByProperty,
  getReviewByRateAndType,
  getReviewByType,
  getReviewByRate,
} from "../../../api/reviewAPI";
import Skeleton from "react-loading-skeleton";
import Pagination from "@mui/material/Pagination";
import { FaTimes } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import {
  TextToRate,
  TextToRateText,
  RateToText,
} from "../../../function/reviewsFunction";
import LoadingIndicator from "../../loadingIndicator/loadingIndicator";

const PropertyReview = ({ property_id, isRefresh, setIsRefresh }) => {
  const RATE = ["Kém", "Ổn", "Tốt", "Tuyệt vời"];

  const TYPE = {
    STAFF: "Staff",
    FACILITIES: "Facilities",
    CLEANLINESS: "Cleaniless",
    COMFORT: "Comfort",
    VALUE_OF_MONEY: "Value of money",
    LOCATION: "Location",
    FREEWIFI: "Free wifi",
  };

  const [reviewPoint, setReviewPoint] = useState({
    Staff: 0,
    Facilities: 0,
    Cleanliness: 0,
    Comfort: 0,
    Value_of_money: 0,
    Location: 0,
    Freewifi: 0,
  });

  const [reviewComment, setReviewComment] = useState([]);

  const [totalPageReview, setTotalPageReview] = useState(0);

  const [allReviewComment, setAllReviewComment] = useState([]);

  const [monthlyRate, setMonthlyRate] = useState({});

  const [allReviewPopUp, setAllReviewPopUp] = useState(false);

  const reviewCommentRef = useRef(null);

  const allReviewRef = useRef(null);

  const [currentAllReviewPage, setCurrentAllReviewPage] = useState(1);

  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isLoadingAllReview, setIsLoadingAllReview] = useState(true);

  const [isLoadingRate, setIsLoadingRate] = useState(true);

  const [reviewFilterType, setReviewFilterType] = useState("");

  const [reviewFilterRate, setReviewFilterRate] = useState("");

  const [reviewSorting, setReviewSorting] = useState(true);

  const [reviewSotingDisabled, setReviewSortingDisabled] = useState(false);

  useEffect(() => {
    setIsRefresh(false);
    fetchTopComments();
    fetchMonthlyRate();
  }, [property_id, isRefresh]);

  useEffect(() => {
    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setReviewSortingDisabled(reviewFilterType || reviewFilterRate);
    setCurrentAllReviewPage(1);
    loadReviews(1);
    return () => {
      setReviewSortingDisabled(false);
    };
  }, [reviewFilterType, reviewFilterRate]);

  async function handleViewAllReview() {
    setIsLoadingAllReview(true);

    document.body.style.overflow = "hidden";

    try {
      const reviewComments = await findReviewWithProperty(property_id, 1);
      setAllReviewComment(reviewComments.reviews);
      setIsLoadingAllReview(false);
      setTotalPageReview(reviewComments.totalPages);
    } catch (e) {
      console.log(`Error at fetching review comment ${e}`);
    }
  }

  // Fetch reviews for a specific page
  async function loadReviews(page) {
    setIsLoadingAllReview(true);
    try {
      var response;
      if (reviewFilterRate && reviewFilterType) {
        const { min, max } = TextToRate(reviewFilterRate);
        response = await getReviewByRateAndType(
          property_id,
          reviewFilterType,
          min,
          max,
          page,
        );
      } else if (reviewFilterRate) {
        const { min, max } = TextToRate(reviewFilterRate);
        response = await getReviewByRate(property_id, min, max, page);
      } else if (reviewFilterType) {
        response = await getReviewByRateAndType(
          property_id,
          reviewFilterType,
          null,
          null,
          page,
        );
      } else {
        response = await findReviewWithProperty(property_id, page);
      }

      setAllReviewComment([...response.reviews]);
      setTotalPageReview(response.totalPages);
      setCurrentAllReviewPage(page);

      console.log(response);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingAllReview(false);
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentAllReviewPage(value);
    loadReviews(value); // Update the page number when pagination changes
  };

  function handleCloseAllReview() {
    document.body.style.overflow = "";
  }

  async function fetchTopComments() {
    setIsLoadingReview(true);
    try {
      const reviewComments = await findReviewWithProperty(property_id, 1);
      setReviewComment(reviewComments.reviews);
      const reviewPointRaw = reviewComments.countReviewsType;
      const reviewPointAvg = {};
      for (const type in reviewPointRaw) {
        const { count, totalRating } = reviewPointRaw[type];
        let avg = totalRating / count;
        reviewPointAvg[type] = parseFloat(avg.toFixed(1));
      }
      setReviewPoint(reviewPointAvg);
      console.log(reviewPoint);
      setIsLoadingReview(false);
    } catch (e) {
      console.log(`Error at fetching review comment ${e}`);
    }
  }

  async function fetchMonthlyRate() {
    setIsLoadingRate(true);
    try {
      const monthRate = await getMonthlyRateByProperty(property_id);
      console.log(monthRate["3"]);
      let count =
        monthRate["1"] +
        monthRate["2"] +
        monthRate["3"] +
        monthRate["4"] +
        monthRate["5"];
      let avarage =
        (0.0 +
          monthRate["1"] +
          monthRate["2"] * 2 +
          monthRate["3"] * 3 +
          monthRate["4"] * 4 +
          monthRate["5"] * 5) /
        count;
      avarage = parseFloat(avarage.toFixed(1));
      console.log(count, avarage);

      setMonthlyRate({
        review_count: count,
        avarage: avarage,
      });
      console.log(monthRate);
      setIsLoadingRate(false);
    } catch (e) {
      console.log(`Error at fetching review comment ${e}`);
    }
  }

  function scrollLeft() {
    if (reviewCommentRef.current) {
      reviewCommentRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  }

  function scrollRight() {
    if (reviewCommentRef.current) {
      reviewCommentRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  }

  function handleTypeFilterChange(e) {
    e.preventDefault();
    setReviewFilterType(e.target.value);
  }

  function handleRateFilterChange(e) {
    e.preventDefault();
    setReviewFilterRate(e.target.value);
  }

  function onFilterChange() {
    if (reviewFilterRate && reviewFilterType) {
      setReviewSortingDisabled(true);
    } else {
      setReviewSortingDisabled(false);
    }
  }

  function handleReviewSortingChange(e) {
    e.preventDefault();
    setReviewSorting(e.target.value);
  }

  return (
    <div className="propertyReview-container">
      <h2>Review</h2>

      <div className="overview-review">
        <div className="avarage-point">
          {!isLoadingRate ? <b>{monthlyRate.avarage}</b> : <Skeleton />}
        </div>
        <div className="rate">
          {!isLoadingRate ? (
            <b>{monthlyRate.avarage > 3 ? "NICE" : "AWFUL"}</b>
          ) : (
            <Skeleton />
          )}
        </div>
        <div className="numberOfReviews">
          {!isLoadingRate ? (
            <b>{monthlyRate.review_count} Reviews</b>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="review-rating-container">
        <h4>Rating</h4>
        <div class="rating-categories">
          {Object.keys(reviewPoint).map((type) => (
            <RatingProgressBar
              key={type}
              categorize={type}
              point={reviewPoint[type]}
            />
          ))}
        </div>
      </div>

      <div className="review-comment-container">
        <h4>Comment</h4>
        <button
          className="left-button"
          onClick={(e) => {
            e.preventDefault();
            scrollLeft();
          }}
        >
          &#8592;
        </button>
        <div className="review-comment" ref={reviewCommentRef}>
          {!isLoadingReview ? (
            reviewComment.map((review, index) => (
              <ReviewComment key={index} review={review} />
            ))
          ) : (
            <LoadingIndicator />
          )}
        </div>
        <button
          className="right-button"
          onClick={(e) => {
            e.preventDefault();
            scrollRight();
          }}
        >
          &#8594;
        </button>
      </div>

      <button
        className="view-all-review-button"
        onClick={(e) => {
          e.preventDefault();
          setAllReviewPopUp(true);
          handleViewAllReview();
        }}
      >
        Toàn bộ đánh giá
      </button>
      {allReviewPopUp && (
        <>
          <div
            className="blockInput"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              setAllReviewPopUp(false);
              handleCloseAllReview();
            }}
          ></div>

          <div
            className="all-reviews"
            onClick={(e) => e.stopPropagation()}
            ref={allReviewRef}
          >
            <div className="allReviews-header">
              <div className="allReviews-topSection">
                <h4>{"Toàn bộ đánh giá"}</h4>
                <FaTimes
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={(e) => {
                    setAllReviewPopUp(false);
                    handleCloseAllReview();
                  }}
                />
              </div>
              <div className="allReviews-filter-sort">
                <div className="allReviews-filter">
                  <h5>{"Lọc"}</h5>
                  <div className="filter-dropdown">
                    <div>
                      <label>{"Loại"}</label>
                      <select
                        value={reviewFilterType}
                        onChange={(e) => handleTypeFilterChange(e)}
                      >
                        <option value="">Lựa chọn</option>
                        {Object.keys(TYPE).map((key) => (
                          <option key={key} value={TYPE[key]}>
                            {TYPE[key]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>{"Điểm"}</label>
                      <select
                        value={reviewFilterRate}
                        onChange={(e) => handleRateFilterChange(e)}
                      >
                        <option value="">Lựa chọn</option>
                        {RATE.map((rate) => (
                          <option key={rate} value={rate}>
                            {TextToRateText(rate)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="allReviews-sorting">
                  <h5>{"Sắp xếp"}</h5>
                  <div className="sorting-dropdown">
                    <div>
                      <label>{"Điểm"}</label>
                      <select
                        value={reviewSorting}
                        onChange={(e) => {
                          handleReviewSortingChange(e);
                        }}
                        disabled={reviewSotingDisabled}
                      >
                        <option value="" disabled>
                          Lựa chọn
                        </option>
                        <option value={true}>Cao đến thấp</option>
                        <option value={false}>Thấp đến cao</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="allReviews-content">
              {!isLoadingAllReview ? (
                allReviewComment.map((review, index) => (
                  <ReviewDetail key={index} review={review} />
                ))
              ) : (
                <LoadingIndicator />
              )}
            </div>

            <div className="review-pagination">
              <Pagination
                count={totalPageReview}
                size="large"
                sx={{
                  width: "80%",
                  "& ul": {
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between", // Space out buttons
                  },
                  "& .MuiPaginationItem-root": {
                    flexGrow: 1, // Make each button stretch equally
                    textAlign: "center",
                  },
                }}
                page={currentAllReviewPage}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyReview;
