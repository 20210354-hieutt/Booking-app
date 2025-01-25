import { useEffect, useMemo, useState } from "react";
import ResultItem from "../../componets/searchResult/ResultItem";
import "./SearchResult.css";
import Navbar from "../../componets/navbar/Navbar";
import { getDistinctPlace } from "../../api/propertyAPI";
import Header from "../../componets/header/Header";
import { findAvailableRoomWithSearch } from "../../api/roomAPI";
import PropertyMap from "../../componets/partner/partnerRegister/Map";
import Loading from "../../componets/loading/Loading";
import { getSessionHistory } from "../../api/sessionAPI";
import { useLocation, useSearchParams } from "react-router-dom";
import NotFound from "../../componets/searchResult/NotFound";
import { Range } from "react-range";
const SearchResult = () => {
  const location = useLocation();

  // const option = JSON.parse(localStorage.getItem('option'))
  const queryString = location.search;

  const params = new URLSearchParams(queryString);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allPlace, setAllPlace] = useState();
  const option = location.state?.option;
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const longitude = location.state?.longitude;
  const latitude = location.state?.latitude;
  const [showFullMap, setShowFullMap] = useState(false);
  const [totalProperties, setTotalProperties] = useState([]);
  const limit = 4;
  const [propetyTypes, setPropertyTypes] = useState([]);
  const [properties, setProperties] = useState();
  const [rates, setRates] = useState([
    { rate: 0, count: 0, name: "0 stars" },
    { rate: 1, count: 0, name: "1 stars" },
    { rate: 2, count: 0, name: "2 stars" },
    { rate: 3, count: 0, name: "3 stars" },
    { rate: 4, count: 0, name: "4 stars" },
    { rate: 5, count: 0, name: "5 stars" },
  ]);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const searchRoom = async () => {
    const response = await findAvailableRoomWithSearch(option);

    setIsLoading(false);
    if (response?.length && response) {
      const uniqueProperties = Array.from(
        response
          .reduce((map, item) => {
            const propertyId = item.value.property_id._id;
            item.value.totalPriceNight = item.totalPriceNight;

            if (!map.has(propertyId)) {
              map.set(propertyId, item.value);
            } else {
              const existingItem = map.get(propertyId);
              if (item.value.property_id.rate > existingItem.property_id.rate) {
                map.set(propertyId, item.value);
              }
            }
            return map;
          }, new Map())
          .values(),
      );

      const sortedProperties = uniqueProperties.sort(
        (a, b) => b.property_id.rate - a.property_id.rate,
      );
      const result = sortedProperties.reduce(
        (acc, item) => {
          const property = item.property_id;
          if (property && property.property_type) {
            if (!acc.propertyTypes[property.property_type]) {
              acc.propertyTypes[property.property_type] = 1;
            } else {
              acc.propertyTypes[property.property_type]++;
            }
          }
          if (property && property.rate !== undefined) {
            const roundedRate = Math.round(property.rate);
            if (!acc.rates[roundedRate]) {
              acc.rates[roundedRate] = 1;
            } else {
              acc.rates[roundedRate]++;
            }
          }
          return acc;
        },
        { propertyTypes: {}, rates: {} },
      );
      const propertyTypesArray = Object.entries(result.propertyTypes).map(
        ([type, count]) => ({ name: type, count }),
      );

      const ratesArray = Object.entries(result.rates).map(([rate, count]) => ({
        name: `${rate} stars`,
        count,
      }));
      setRates((prevRates) =>
        prevRates.map((item) => {
          const match = ratesArray.find((r) => r.name === item.name);

          return match ? { ...item, count: match.count } : item;
        }),
      );
      setPropertyTypes(propertyTypesArray);

      setTotalProperties(sortedProperties);
      const paginatedProperties = sortedProperties.slice(
        currentPage - 1,
        currentPage - 1 + limit,
      );

      const totalPages = Math.ceil(sortedProperties.length / limit);
      setTotalPages(totalPages);
      setProperties(paginatedProperties);
    } else {
      setNotFound(true);
    }
  };

  const [filters, setFilters] = useState({
    propertyType: [],
    budget: [],
    ratingNumber: [],
    ratingName: [],
  });
  const [values, setValues] = useState([100000, 20000000]);
  const handleChange = (newValues) => {
    setValues(newValues);
  };
  const applyFilter = () => {
    console.log(filters);
    if (!totalProperties) return;
    let filtered = totalProperties.filter((property) => {
      return filters.propertyType.length > 0
        ? filters.propertyType.includes(property.property_id.property_type)
        : true;
    });

    if (filters.ratingNumber.length > 0) {
      filtered = filtered.filter(
        (property) =>
          Math.round(property.property_id.rate) ===
          Number(filters.ratingNumber[0]),
      );
    }

    console.log(values)
    filtered = filtered.filter(
      (property) => {
        console.log(property);

        return property.totalPriceNight >= values[0] &&
          property.totalPriceNight <= values[1];
      });

    console.log(filtered);

    const paginatedProperties = filtered.slice(
      currentPage - 1,
      currentPage - 1 + limit,
    );

    setProperties(paginatedProperties);
    const totalPages = Math.ceil(filtered.length / limit);
    setTotalPages(totalPages);
  };
  const handlePropertyTypeChange = (type) => {

    if (filters.propertyType.name === type) {
      setFilters({ ...filters, propertyType: [] });
    } else {
      setFilters({ ...filters, propertyType: [type] });
    }
  };

  const handleRatingChange = (rating, ratingNumber) => {
    if (filters.ratingName[0] === rating) {
      setFilters({ ...filters, ratingName: [], ratingNumber: [] });
    } else {
      setFilters({
        ...filters,
        ratingName: [rating],
        ratingNumber: [ratingNumber],
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (location.state?.option) {
      const handleGetAllProperty = async () => {
        const respone = await getDistinctPlace();
        setAllPlace(respone);
      };
      handleGetAllProperty();
      searchRoom();
    }
  }, [location.state?.option, currentPage]);

  useEffect(() => {
    applyFilter();
  }, [filters, values, currentPage]);

  return (
    <>
      <Navbar />
      <Header places={allPlace} promptData={option} />
      {isLoading ? (
        <Loading />
      ) : notFound ? (
        <NotFound place={location.state?.option.place} />
      ) : properties ? (
        <div className="search-result-container">
          <div className="search-container-left">
            <div className="filter-bar">
              <div className="filter-section">
                <h4>Property Type</h4>
                {propetyTypes.map((type) => (
                  <div key={type.name} className="fix-width">
                    <label>
                      <input
                        type="radio"
                        checked={filters.propertyType.includes(type.name)}
                        onChange={() => handlePropertyTypeChange(type.name)}
                      />
                      {type.name} ({type.count})
                    </label>
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <h4>Your Budget (per night)</h4>
                <Range
                  step={100000}
                  min={100000}
                  max={20000000}
                  values={values}
                  onChange={(values) => handleChange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        background: "#ddd",
                        position: "relative",
                        borderRadius: "3px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          height: "6px",
                          background: "#0c969c",
                          borderRadius: "3px",
                          left: `${((values[0] - 100000) / (20000000 - 100000)) * 100}%`,
                          right: `${100 - ((values[1] - 100000) / (20000000 - 100000)) * 100}%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "20px",
                        width: "20px",
                        backgroundColor: "#0c969c",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 2px 6px #aaa",
                      }}
                    >
                      <div
                        style={{
                          height: "10px",
                          width: "10px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  )}
                />
                <div className="range-values">
                  <span>Min: VND {values[0].toLocaleString()}</span>
                  <span>Max: VND {values[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="filter-section">
                <h4>Property Rating</h4>
                {rates.map((rating, index) => (
                  <div key={rating.name} className="fix-width">
                    <label>
                      <input
                        type="radio"
                        name="rating"
                        value={rating.name}
                        checked={filters.ratingName.includes(rating.name)}
                        onChange={() => handleRatingChange(rating.name, index)}
                      />
                      {rating.name} ({rating.count})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="main-content">
            <div className="header-search">
              <h1>
                {params.get("place")
                  ? params.get("place")
                  : params.get("type")
                    ? params.get("type")
                    : location.state?.option?.province}
                : {properties.length} properties found
              </h1>
            </div>
            <button className="sort-button">
              Sort by: Top picks for families
            </button>
            <div className="results-list">
              {properties.map((property, index) => (
                <ResultItem
                  key={property.property_id._id}
                  property={property}
                  index={index}
                  option={option}
                />
              ))}
            </div>
            <div className="pagination-controls">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default SearchResult;
