import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUmbrellaBeach,
  faPersonHiking,
  faCity,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

import "./easyTrip.css";
import { useNavigate } from "react-router-dom";

function EasyTrip({ propertyNear }) {
  const handleClick = (id) => {
    setType(id);
  };

  const [type, setType] = useState(1);

  const navigate = useNavigate();
  const handleNavigate = async (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="easyTrip">
      <div className="locationList">
        <Swiper
          className="swiper"
          spaceBetween={15} // Khoảng cách giữa các slide
          slidesPerView={4} // Số slide hiển thị một lúc
          navigation // Thêm điều khiển điều hướng
          pagination={{ clickable: true }} // Thêm phân trang
          modules={[Navigation, Pagination]} // Thêm các module vào đâyx
        >
          {propertyNear &&
            propertyNear.map((item) => {
              return (
                <SwiperSlide
                  className="swiperSlide"
                  key={item.property._id}
                  onClick={() => handleNavigate(item.property._id)}
                >
                  <div className="locationItem">
                    <div className="locationItemImg">
                      <img src={item.property.images[0]} alt="" />
                    </div>

                    <div className="locationItemTitle">
                      <h3>{item.property.name}</h3>
                      <div>{item.distance} km away from you</div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
}

export default EasyTrip;
