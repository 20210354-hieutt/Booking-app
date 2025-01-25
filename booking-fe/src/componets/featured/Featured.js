import React from "react";
import "./featured.css";

function Featured() {
  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o="
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Ho Chi Minh</h1>
          <h2>123 properties</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o="
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Ho Chi Minh</h1>
          <h2>123 properties</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o="
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Ho Chi Minh</h1>
          <h2>123 properties</h2>
        </div>
      </div>
    </div>
  );
}

export default Featured;
