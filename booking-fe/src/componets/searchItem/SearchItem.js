import React from "react";
import "./searchItem.css";

function SearchItem() {
  return (
    <div className="searchItem">
      <img
        src="https://cf2.bstatic.com/xdata/images/hotel/square600/602137910.webp?k=ee7336af2b01de30fc30ecb647208258ceb13f9797ea755465418d348e1aa7e0&o="
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">Cocochine Da Nang</h1>
        <span className="siLocation">
          <span className="siAddress">My Khe Beach,Danang</span>
          <span className="siMap">Show on map</span>
          <span className="siDistance">3.5 km from downtown</span>
        </span>

        <span className="siTaxiOp">Limited-time Deal</span>
        <div className="siInformation">
          <span className="siSubtitle">Superior Double Room</span>
          <span className="siFeatures">1 queen bed</span>
          <span className="siCancelOp">
            Only 2 rooms left at this price on our site{" "}
          </span>
        </div>
      </div>
      <div className="siDetails">
        <div className="siEvaluation">
          <div className="siRating">
            <div className="siComment">Excellent</div>
            <div className="siReview">141 reviews</div>
          </div>

          <div className="siScore">
            <div>5.0</div>
          </div>
        </div>

        <div className="siDetailTexts">
          <span className="siPrice">VND 1,400,000</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton">See aviability</button>
        </div>
      </div>
    </div>
  );
}

export default SearchItem;
