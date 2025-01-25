import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPropertyById } from "../../../api/propertyAPI";
import "./PartnerPropertyDetail.css";
import Slider from "react-slick";
import { findRoomByProperty } from "../../../api/roomAPI";
import DashboardPage from "../partnerDashboard/DashboardPage";
import PropertyDetailsForm from "../partnerRegister/PropertyDetailsForm";
import { formatCurrency } from "../../../helpers/currencyHelpers";
const PropertyDetail = ({ propertyId, tab, setTab }) => {
  const [property, setProperty] = useState(null);
  const longitude = localStorage.getItem("longitude");
  const latitude = localStorage.getItem("latitude");
  const [rooms, setRooms] = useState();
  useEffect(() => {
    const getProperty = async () => {
      const respone = await getPropertyById(propertyId);
      setProperty(respone);

      if (respone) {
        localStorage.setItem("property", JSON.stringify(respone));
        const findRoom = await findRoomByProperty(respone._id);
        console.log(findRoom);

        if (findRoom) {
          setRooms(findRoom || []);
        }
      }
    };
    getProperty();
  }, [propertyId, tab]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };
  return (
    <>
      {tab === "info" ? (
        property &&
        rooms && (
          <div className="content-wrapper">
            <section className="content-header">
              <h1>Property Details</h1>
            </section>
            <section className="content">
              <div className="card card-primary mx-auto">
                <div className="card-header">{property.name}</div>
                <div className="card-body">
                  <p>
                    <strong>Description:</strong> {property.description}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {`${property.address.street}, ${property.address.ward}, ${property.address.district}, ${property.address.province}`}
                  </p>
                  <p>
                    <strong>Property Type:</strong> {property.property_type}
                  </p>
                  <p>
                    <strong>Rating:</strong> {property.rate}
                  </p>

                  <div>
                    <h4>Images:</h4>
                    {property.images.length > 1 ? (
                      <Slider {...settings}>
                        {property.images.map((image, index) => (
                          <div key={index} className="carousel-image">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="img-thumbnail"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div>
                        <img
                          src={property.images[0]}
                          all={"Property Image Review"}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                  </div>

                  <div className="rooms-section">
                    <h3>Rooms</h3>
                    {rooms && rooms.length > 0 ? (
                      rooms.map((room, index) => (
                        <div className="room-card" key={index}>
                          <p className="room-info-title">{room.name}</p>
                          <p className="room-detail">
                            <strong>Type:</strong> {room.type || "None"}
                          </p>
                          <p className="room-detail">
                            <strong>Size:</strong> {room.size || 0} sqm
                          </p>
                          <p className="room-detail">
                            <strong>Rating:</strong> {room.rating || 0}/5
                          </p>

                          <p className="room-detail">
                            <strong>Price per night:</strong> Weekday:{" "}
                            {formatCurrency(room.price_per_night.weekday)},
                            Weekend:{" "}
                            {formatCurrency(room.price_per_night.weekend)}
                          </p>
                          <p className="room-detail">
                            <strong>Capacity:</strong>{" "}
                            {room.capacity.adults || 0} adults,{" "}
                            {room.capacity.childs.count || 0} children
                          </p>
                          <div className="room-facility-list">
                            {room.facility.map((facility, idx) => (
                              <span key={idx} className="room-facility-item">
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1>No rooms</h1>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
      ) : tab === "update" ? (
        <PropertyDetailsForm
          longitude={longitude}
          latitude={latitude}
          type={"update"}
          setTab={setTab}
        />
      ) : (
        <DashboardPage type={"property"} property={property} />
      )}
    </>
  );
};
const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        fontSize: "24px",
        right: "-30px",
        color: "blue",
      }}
      onClick={onClick}
    >
      <i className="fas fa-arrow-right"></i>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        fontSize: "24px",
        left: "-30px",
        color: "blue",
      }}
      onClick={onClick}
    >
      <i className="fas fa-arrow-left"></i>
    </div>
  );
};

export default PropertyDetail;
