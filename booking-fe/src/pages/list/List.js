import React from "react";
import Header from "../../componets/header/Header";
import Navbar from "../../componets/navbar/Navbar";
import "./list.css";
import SearchItem from "../../componets/searchItem/SearchItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Budget from "../../componets/budget/Budget";
import Footer from "../../componets/footer/Footer";
function List() {
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <div className="searchMap">
              <div className="mapImage">
                <img
                  src="https://images.adsttc.com/media/image_maps/6595/8fe0/9936/3f73/b48a/b2f1/large/open-uri20240103-1-ztzhdg.jpg?1704300513"
                  alt=""
                />
              </div>
              <button className="mapButton">
                <FontAwesomeIcon icon={faLocationDot} />
                <div className="mapShow">Show on map</div>
              </button>
            </div>

            <div className="filter">
              <div className="ftTitle">
                <h2>Filter by:</h2>
              </div>
              <hr />
              <Budget />
              <hr />
              <div className="filterGroup">
                <div className="fgTitle">Popular filters</div>
                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Apartments</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free cancellation</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Book without credit card</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>
              </div>
              <hr />
              <div className="filterGroup">
                <div className="fgTitle">Popular filters</div>
                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Apartments</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free cancellation</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Book without credit card</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>
              </div>

              <hr />
              <div className="filterGroup">
                <div className="fgTitle">Popular filters</div>
                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Apartments</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free cancellation</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Book without credit card</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>

                <div className="fgContent">
                  <label class="condition">
                    <input type="checkbox" class="checkbox" />
                    <span class="checkmark"></span>
                    <span className="text">Free WiFi</span>
                  </label>
                  <div className="numRes">2004</div>
                </div>
              </div>
            </div>
          </div>
          <div className="listResult">
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default List;
