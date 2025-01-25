import React, { useEffect, useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCar,
  faPlane,
  faTaxi,
  faCalendarDays,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { findAvailableRoomWithSearch } from "../../api/roomAPI";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getDistinctPlace } from "../../api/propertyAPI";

function Header({ type, places, promptData }) {
  const [openDate, setOpenDate] = useState(false);
  const [placesToShowDropDown, setPlacesToShowDropDown] = useState();
  const location = useLocation();
  const latitude = localStorage.getItem("latitude");
  const longitude = localStorage.getItem("longitude");
  const oneDayLater = new Date();
  useEffect(() => {
    setPlacesToShowDropDown(places);
  }, [places]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: oneDayLater.setDate(oneDayLater.getDate() + 1),
      key: "selection",
    },
  ]);

  function formatDate(date) {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);

    return formattedDate.replace(",", ""); // Loại bỏ dấu phẩy
  }

  const [options, setOptions] = useState({
    adult: 2,
    children: 0,
    room: 1,
  });

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const checkAdults = options.adult > 1 ? "adults" : "adult";
  const checkRooms = options.room > 1 ? "rooms" : "room";
  const navigate = useNavigate();
  const [province, setProvince] = useState("");
  const handleChangeProvince = (e) => {
    setProvince(e.target.value);
    const searchPlace = places.filter((place) =>
      place.includes(e.target.value),
    );
    setPlacesToShowDropDown(searchPlace);
  };

  const [openOptions, setOpenOptions] = useState(false);

  const [selectedAge, setSelectedAge] = useState("");

  const handleChange = (e) => {
    setSelectedAge(e.target.value);
  };
  const handleClick = async (e) => {
    const userId = localStorage.getItem("userId");
    const option = JSON.parse(localStorage.getItem("option"));
    option.check_in = moment(date[0].startDate).format("YYYY-MM-DD");
    option.check_out = moment(date[0].endDate).format("YYYY-MM-DD");
    option.capacity.adults = options.adult;
    option.capacity.childs.count = options.children;
    option.capacity.childs.age = selectedAge;
    option.capacity.room = options.room;
    localStorage.setItem("option", JSON.stringify(option));
    const data = {
      userId,
      place: province,
      check_in: moment(date[0].startDate).format("YYYY-MM-DD"),
      check_out: moment(date[0].endDate).format("YYYY-MM-DD"),
      capacity: {
        adults: options.adult,
        childs: {
          count: options.children,
          age: parseInt(selectedAge),
        },
        room: options.room,
      },
    };
    data.province = data.place;

    navigate("/searchResult", {
      state: { option: data, longitude, latitude },
    });
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleSelectSuggestion = async (province) => {
    setProvince(province);
  };
  useEffect(() => {
    if (promptData) {
      setDate([
        {
          endDate: new Date(promptData.check_out),
          startDate: new Date(promptData.check_in),
        },
      ]);

      setOptions({
        adult: promptData.capacity.adults,
        children: promptData.capacity.childs.count,
        room: promptData.capacity.room,
      });
      setProvince(promptData.place);
    }
  }, [promptData]);
  const handleChangeDate = (item) => {
    setDate([item.selection || item.range1]);
  };
  useEffect(() => {
    const check_in = JSON.parse(localStorage.getItem("option"))?.check_in;
    const check_out = JSON.parse(localStorage.getItem("option"))?.check_out;

    if (!check_in && !check_out) {
      const option = {
        capacity: {
          childs: {
            count: 0,
            age: 0,
          },
          room: 0,
        },
      };
      option.check_in = moment(date[0].startDate).format("YYYY-MM-DD");
      option.check_out = moment(date[0].endDate).format("YYYY-MM-DD");
      option.capacity.adults = 2;
      option.capacity.childs.count = 0;
      option.capacity.room = 1;
      localStorage.setItem("option", JSON.stringify(option));
      console.log(date);
    } else {
      const option = JSON.parse(localStorage.getItem("option"));
      setOptions({
        adult: option.capacity.adults,
        children: option.capacity.childs.count,
        room: option.capacity.room,
      });
      setDate([
        {
          startDate: moment(option.check_in, "YYYY-MM-DD").toDate(),
          endDate: moment(option.check_out, "YYYY-MM-DD").toDate(),
        },
      ]);
    }
  }, []);
  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {type !== "list" && (
          <>
            <h1 className="headerTitle">Find your next stay</h1>
            <p className="headerDesc">
              Search low prices on hotels, homes and much more...
            </p>
          </>
        )}
        <div className="headerSearch">
          <div
            className="headerSearchItem iconBed"
            onFocus={() => {
              setShowSuggestions(true);
              setOpenDate(false);
              setOpenOptions(false);
            }}
            onBlur={() => setShowSuggestions(false)}
          >
            <FontAwesomeIcon icon={faBed} className="headerIcon" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="headerSearchInput"
              value={province}
              onChange={(e) => handleChangeProvince(e)}
              required
            />
          </div>
          {showSuggestions && placesToShowDropDown && (
            <div className="suggestionsDropdown">
              <div className="suggestionsTitle">
                Popular destinations nearby
              </div>
              {placesToShowDropDown.map(
                (place, index) =>
                  index < 6 && (
                    <div
                      key={index}
                      className="suggestionItem"
                      onMouseDown={() => handleSelectSuggestion(place)}
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="suggestionIcon"
                      />
                      <div className="suggestionText">
                        <div className="suggestionName">{place}</div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
          <div className="headerSearchItem iconCalendar">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <span
              onClick={() => {
                setShowSuggestions(false);
                setOpenDate(!openDate);
                setOpenOptions(false);
              }}
              className="headerSearchText"
            >{`${formatDate(date[0].startDate)} - ${formatDate(date[0].endDate)}`}</span>
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => handleChangeDate(item)}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className="date"
              />
            )}
          </div>

          <div className="headerSearchItem iconUser">
            <FontAwesomeIcon icon={faUser} className="headerIcon" />
            <span
              onClick={() => {
                setShowSuggestions(false);
                setOpenDate(false);
                setOpenOptions(!openOptions);
              }}
              className="headerSearchText"
            >{`${options.adult} ${checkAdults} · ${options.children} children · ${options.room} ${checkRooms}`}</span>
            {openOptions && (
              <div className="options">
                <div className="optionItem">
                  <span className="optionText">Adult</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.adult <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.adult}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="optionItem">
                  <span className="optionText">Children</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.children <= 0}
                      onClick={() => handleOption("children", "d")}
                      className="optionCounterButton"
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">
                      {options.children}
                    </span>
                    <button
                      onClick={() => handleOption("children", "i")}
                      className="optionCounterButton"
                    >
                      +
                    </button>
                  </div>
                </div>
                {options.children !== 0 ? (
                  <div className="childrenAge">
                    <div className="childAge">
                      <select
                        className="selectAge"
                        name="age"
                        onChange={(e) => handleChange(e)}
                      >
                        <option value="-1" data-key="-1">
                          Age needed
                        </option>
                        <option value="0" data-key="0">
                          0 years old
                        </option>
                        <option value="1" data-key="1">
                          1 year old
                        </option>
                        <option value="2" data-key="2">
                          2 years old
                        </option>
                        <option value="3" data-key="3">
                          3 years old
                        </option>
                        <option value="4" data-key="4">
                          4 years old
                        </option>
                        <option value="5" data-key="5">
                          5 years old
                        </option>
                        <option value="6" data-key="6">
                          6 years old
                        </option>
                        <option value="7" data-key="7">
                          7 years old
                        </option>
                        <option value="8" data-key="8">
                          8 years old
                        </option>
                        <option value="9" data-key="9">
                          9 years old
                        </option>
                        <option value="10" data-key="10">
                          10 years old
                        </option>
                        <option value="11" data-key="11">
                          11 years old
                        </option>
                        <option value="12" data-key="12">
                          12 years old
                        </option>
                        <option value="13" data-key="13">
                          13 years old
                        </option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="childrenAge"></div>
                )}
                <div className="optionItem">
                  <span className="optionText">Room</span>
                  <div className="optionCounter">
                    <button
                      disabled={options.room <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.room}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="headerSearchItem btn">
            <button className="headerBtn" onClick={(e) => handleClick(e)}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
