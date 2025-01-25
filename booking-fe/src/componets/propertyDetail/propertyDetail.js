import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ContentLoader from "react-content-loader";
import "./propertyDetail.css";
import ReservationRoom from "./reservationRoom/reservationRoom";
import { getPropertyById } from "../../api/propertyAPI";
import {
  findRoomByProperty,
  getRoomWithPriceByProperty,
} from "../../api/roomAPI";
import { getMonthlyRateByProperty } from "../../api/reviewAPI";
import { updateLastProperties } from "../../api/sessionAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlane } from "@fortawesome/free-solid-svg-icons";
import Map from "../partner/partnerRegister/Map";
import PropertyReview from "./propertyReview/propertyReview";
import WriteReview from "./writeReview/writeReview";
import { convertMonthlyRateData } from "../../function/reviewsFunction";

const PropertyDetail = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const [location, setLocation] = useState("");
  const [selectedTab, setSelectedTab] = useState(1);
  const infoPrices = useRef(null);
  const review = useRef(null);
  const overView = useRef(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [reviewInfo, setReviewInfo] = useState(null);

  const [refreshReview, setRefreshReview] = useState(false);

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };
  const handleUpdateViewProperties = async () => {
    if (userId) {
      await updateLastProperties(userId, id);
    }
  };
  useEffect(() => {
    handleUpdateViewProperties();
  }, []);

  useEffect(() => {
    if (propertyData && reviewInfo && location) {
      setPropertyInfo(() => ({
        hotelName: propertyData[0].room.property_id.name,
        address: location,
        property: id,
        reviews: {
          total: reviewInfo.count,
          point: reviewInfo.avarage,
        },
      }));
    }

    console.log(propertyInfo);
  }, [propertyData, reviewInfo, location]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const pId = id.toString();
        const check_in = JSON.parse(localStorage.getItem("option")).check_in;
        const check_out = JSON.parse(localStorage.getItem("option")).check_out;
        try {
          const data = await getRoomWithPriceByProperty(
            pId,
            check_in,
            check_out,
          );
          console.log(data);

          setPropertyData(data);
          const { street, district, province } =
            data[0].room.property_id.address;
          setLocation(`${street}, ${district}, ${province}`);

          const reviews = await getMonthlyRateByProperty(pId);

          const convertReviews = convertMonthlyRateData(reviews);

          setReviewInfo(convertReviews);

          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      } else {
        setTimeout(() => {
          setPropertyData({
            name: "Indochine Hotel SG",
            location: "District 1, Ho Chi Minh City, Vietnam",
            description:
              "Located in Ho Chi Minh City, 300 meters from Fine Arts Museum, Indochine Hotel SG provides accommodation with a garden, free private parking, a terrace, and a restaurant.",
            images: [
              "https://via.placeholder.com/300x200", // Image 1
              "https://via.placeholder.com/300x200", // Image 2
              "https://via.placeholder.com/300x200", // Image 3
            ],
          });
          setRoomData([
            {
              id: 1,
              type: "Superior Queen Room",
              description: "1 large double bed",
              guests: 2,
              originalPrice: "VND 4,780,000",
              discountedPrice: "VND 3,830,400",
              features: [
                "22 m²",
                "Air conditioning",
                "Private bathroom",
                "Flat-screen TV",
                "Soundproofing",
                "Free WiFi",
              ],
              choices: ["Very good breakfast included", "Non-refundable"],
            },
            {
              id: 2,
              type: "Deluxe Queen Room",
              description: "1 large double bed",
              guests: 2,
              originalPrice: "VND 5,130,000",
              discountedPrice: "VND 4,104,000",
              features: [
                "24 m²",
                "View",
                "Air conditioning",
                "Private bathroom",
                "Flat-screen TV",
                "Soundproofing",
                "Free WiFi",
              ],
              choices: [
                "Very good breakfast included",
                "Free cancellation before 31 October 2024",
                "No prepayment needed - pay at the property",
              ],
            },
            {
              id: 3,
              type: "Deluxe Queen Room",
              description: "1 large double bed",
              guests: 2,
              originalPrice: "VND 5,643,000",
              discountedPrice: "VND 4,514,400",
              features: [
                "24 m²",
                "Air conditioning",
                "Private bathroom",
                "Flat-screen TV",
                "Soundproofing",
                "Free WiFi",
              ],
              choices: ["Very good breakfast included", "Non-refundable"],
            },
          ]);
          setLoading(false);
        }, 3000); // 3 seconds delay to simulate loading time
      }
    };

    fetchData();
  }, [id]); // Dependency on id

  const refreshReviewSection = () => {
    setRefreshReview(true);
  };

  const handleTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
    if (tabNumber === 2 && infoPrices.current) {
      infoPrices.current.scrollIntoView({ behavior: "smooth" });
    } else if (tabNumber === 1 && overView.current) {
      overView.current.scrollIntoView({ behavior: "smooth" });
    } else if(tabNumber === 3 && review.current){
      review.current.scrollIntoView({behavior: "smooth"})
    }
  };

  return (
    <div className="propertyDetail-container">
      {loading ? (
        <ContentLoader
          speed={2}
          width="100%"
          height={400}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Header */}
          <rect x="10%" y="20" rx="4" ry="4" width="80%" height="30" />
          <rect x="15%" y="60" rx="3" ry="3" width="70%" height="20" />

          {/* Image placeholders */}
          <rect x="10%" y="100" rx="8" ry="8" width="25%" height="180" />
          <rect x="37%" y="100" rx="8" ry="8" width="25%" height="180" />
          <rect x="64%" y="100" rx="8" ry="8" width="25%" height="180" />

          {/* Description */}
          <rect x="10%" y="300" rx="3" ry="3" width="80%" height="10" />
          <rect x="10%" y="320" rx="3" ry="3" width="75%" height="10" />
          <rect x="10%" y="340" rx="3" ry="3" width="60%" height="10" />
        </ContentLoader>
      ) : (
        <>
          <div className="propertyDetail-box">
            <div className="propertyDetail-navigateBar">
              <button
                className={
                  selectedTab === 1
                    ? "navigate-button selectedTab"
                    : "navigate-button"
                }
                onClick={() => handleTabClick(1)}
              >
                Overview
              </button>
              <button
                className={
                  selectedTab === 2
                    ? "navigate-button selectedTab"
                    : "navigate-button"
                }
                onClick={() => handleTabClick(2)}
              >
                Info & prices
              </button>
              <button
                className={
                  selectedTab === 4
                    ? "navigate-button selectedTab"
                    : "navigate-button"
                }
              >
                Facilities
              </button>
              <button
                className={
                  selectedTab === 3
                    ? "navigate-button selectedTab"
                    : "navigate-button"
                }
                onClick={() => handleTabClick(3)}

              >
                Guest review
              </button>
            </div>
            <div className="propertyDetail-header">
              <div className="propertyDetail-name">
                <h1> {propertyData[0].room.property_id.name} </h1>
                <button
                  onClick={() =>
                    infoPrices.current.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Reserve
                </button>
              </div>
              <p>
                {" "}
                <FontAwesomeIcon icon={faLocationDot} className="icon" />{" "}
                {location}
              </p>
            </div>
            <div className="mapContainer">
              <div className="container-left-description">
                <div className="propertyDetail-image">
                  {propertyData[0].room.property_id.images.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Image ${index + 1}`}
                      className={index === 0 ? "large" : ""}
                    />
                  ))}

                  {/* Add placeholders if there are fewer than 6 images */}
                  {Array.from({
                    length: Math.max(
                      6 - propertyData[0].room.property_id.images.length,
                      0,
                    ),
                  }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className={`placeholder ${propertyData[0].room.property_id.images.length === 0 && index === 0 ? "large" : ""}`}
                    />
                  ))}
                </div>

                <div className="propertyDetail-description">
                  <p>{propertyData[0].room.property_id.description}</p>
                </div>
              </div>
              <div className="mini-map">
                <Map
                  onLocationSelect={() => {}}
                  initialLocation={{
                    lat: propertyData[0].room.property_id.location.latitude,
                    lng: propertyData[0].room.property_id.location.longitude,
                  }}
                  disableClick={true}
                  allowPositionChange={false}
                  showPropertyInfo={false}
                />
                <button className="open-map-button" onClick={handleOpenMap}>
                  Open Map
                </button>
              </div>
            </div>
            {isMapOpen && (
              <div
                className="modal-overlay"
                onClick={() => {
                  handleCloseMap();
                }}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="model-contentt">
                    <button
                      className="circle-close-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseMap();
                      }}
                    >
                      &times;
                    </button>
                    <Map
                      onLocationSelect={() => {}}
                      initialLocation={{
                        lat: propertyData[0].room.property_id.location.latitude,
                        lng: propertyData[0].room.property_id.location
                          .longitude,
                      }}
                      disableClick={true}
                      setOpenMap={setIsMapOpen}
                      allowPositionChange={false}
                      showPropertyInfo={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {propertyData && (
            <div ref={infoPrices} className="reservation-room">
              <ReservationRoom
                roomData={propertyData}
                partnerId={propertyData[0].room.property_id.owner_id}
                propertyInfo={propertyInfo}
              />
            </div>
          )}
          <div className="property-review" ref={review}>
            <PropertyReview
              property_id={id}
              isRefresh={refreshReview}
              setIsRefresh={setRefreshReview}
            />
          </div>
          <div className="property-writeReview">
            <WriteReview
              rooms={propertyData}
              refreshReviewSection={refreshReviewSection}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyDetail;
