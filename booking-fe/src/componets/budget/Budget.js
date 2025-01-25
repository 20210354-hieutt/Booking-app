import React, { useState, useEffect } from "react";
import "./budget.css";
import ReactSlider from "react-slider";

function Budget() {
  const [MAX, setMAX] = useState(3000000);
  const MIN = 100000;

  function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat("vi-VN");
    return formatter.format(amount);
  }

  const [pricingMode, setPricingMode] = useState(" (per night)");
  const [values, setValues] = useState([MIN, MAX]);
  const [activeButton, setActiveButton] = useState("perNight");

  const handleClickMode = (mode) => {
    setActiveButton(mode);
    if (mode === "perNight") {
      setPricingMode(" (per night)");
      setValues([100000, 3000000]);
      setMAX(300000);
    } else {
      setPricingMode(" (for 17 nights)");
      setValues([100000, 60000000]);
      setMAX(60000000);
    }
  };

  return (
    <div className="budget">
      <div className="budgetTitle">
        <span>Your budget {pricingMode}</span>
      </div>

      <div className="pricingMode">
        <button
          className={`btnPN ${activeButton === "perNight" ? "active" : ""}`}
          onClick={() => handleClickMode("perNight")}
        >
          Per night
        </button>
        <button
          className={`btnES ${activeButton === "entireStay" ? "active" : ""}`}
          onClick={() => handleClickMode("entireStay")}
        >
          Entire stay
        </button>
      </div>

      <div className="filterPrice">
        <div className="status">
          <span>
            VND {formatCurrency(values[0])} - VND {formatCurrency(values[1])}
          </span>
        </div>

        <div className="histogram">
          <span className="cdad45789b" style={{ height: "0%" }}></span>
          <span className="cdad45789b" style={{ height: "5%" }}></span>
          <span className="cdad45789b" style={{ height: "18%" }}></span>
          <span className="cdad45789b" style={{ height: "64%" }}></span>
          <span className="cdad45789b" style={{ height: "94%" }}></span>
          <span className="cdad45789b" style={{ height: "88%" }}></span>
          <span className="cdad45789b" style={{ height: "100%" }}></span>
          <span className="cdad45789b" style={{ height: "83%" }}></span>
          <span className="cdad45789b" style={{ height: "67%" }}></span>
          <span className="cdad45789b" style={{ height: "56%" }}></span>
          <span className="cdad45789b" style={{ height: "56%" }}></span>
          <span className="cdad45789b" style={{ height: "41%" }}></span>
          <span className="cdad45789b" style={{ height: "42%" }}></span>
          <span className="cdad45789b" style={{ height: "45%" }}></span>
          <span className="cdad45789b" style={{ height: "45%" }}></span>
          <span className="cdad45789b" style={{ height: "37%" }}></span>
          <span className="cdad45789b" style={{ height: "43%" }}></span>
          <span className="cdad45789b" style={{ height: "29%" }}></span>
          <span className="cdad45789b" style={{ height: "33%" }}></span>
          <span className="cdad45789b" style={{ height: "33%" }}></span>
          <span className="cdad45789b" style={{ height: "27%" }}></span>
          <span className="cdad45789b" style={{ height: "31%" }}></span>
          <span className="cdad45789b" style={{ height: "24%" }}></span>
          <span className="cdad45789b" style={{ height: "22%" }}></span>
          <span className="cdad45789b" style={{ height: "22%" }}></span>
          <span className="cdad45789b" style={{ height: "27%" }}></span>
          <span className="cdad45789b" style={{ height: "14%" }}></span>
          <span className="cdad45789b" style={{ height: "18%" }}></span>
          <span className="cdad45789b" style={{ height: "20%" }}></span>
          <span className="cdad45789b" style={{ height: "14%" }}></span>
          <span className="cdad45789b" style={{ height: "19%" }}></span>
          <span className="cdad45789b" style={{ height: "10%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
          <span className="cdad45789b" style={{ height: "11%" }}></span>
          <span className="cdad45789b" style={{ height: "12%" }}></span>
          <span className="cdad45789b" style={{ height: "9%" }}></span>
          <span className="cdad45789b" style={{ height: "10%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
          <span className="cdad45789b" style={{ height: "6%" }}></span>
          <span className="cdad45789b" style={{ height: "10%" }}></span>
          <span className="cdad45789b" style={{ height: "3%" }}></span>
          <span className="cdad45789b" style={{ height: "4%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
          <span className="cdad45789b" style={{ height: "5%" }}></span>
          <span className="cdad45789b" style={{ height: "9%" }}></span>
          <span className="cdad45789b" style={{ height: "5%" }}></span>
          <span className="cdad45789b" style={{ height: "8%" }}></span>
          <span className="cdad45789b" style={{ height: "7%" }}></span>
        </div>

        <div className="priceSlider">
          <ReactSlider
            className="slider"
            onChange={setValues}
            value={values}
            min={MIN}
            max={MAX}
          />
        </div>
      </div>
    </div>
  );
}

export default Budget;
