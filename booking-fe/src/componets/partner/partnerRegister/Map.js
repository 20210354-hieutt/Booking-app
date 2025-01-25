// Map.js
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  getAllProperty,
  getPropertyAndPriceByDistance,
} from "../../../api/propertyAPI";
import L from "leaflet";
import "./Map.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import ReactDOMServer from "react-dom/server";
import { getAllRoomWithTotalPrice } from "../../../api/roomAPI";
import Loading from "../../loading/Loading";
import { calculateNights } from "../../../helpers/dateHelpers";
import { useNavigate } from "react-router-dom";
import { Range } from "react-range";
const createUserMarkerIcon = () => {
  return L.divIcon({
    className: "user-marker-container",
    html: `
            <div class="user-marker-glow"></div>
            <div class="user-marker"></div>
        `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
  });
};
const createPropertyMarkerIcon = (totalPriceNight) => {
  return L.divIcon({
    className: "property-marker-container fall-down", // Thêm lớp `fall-down`
    html: ` <div class="property-marker">
                <div class="property-marker-shadow"></div>
                <div class="icon">
                    ${ReactDOMServer.renderToString(<FontAwesomeIcon icon={faLocationDot} style={{ color: "#74C0FC" }} />)}
                </div>
                  ${
                    totalPriceNight &&
                    ReactDOMServer.renderToString(
                      <div class="property-price">{totalPriceNight}</div>,
                    )
                  } 
                
            </div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
};
const Map = ({
  onLocationSelect,
  initialLocation,
  disableClick,
  option,
  allowPositionChange,
  showPropertyInfo,
  setOpenMap,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const getRoomWithPrice = async () => {
    setIsLoading(true);
    const respone = await getAllRoomWithTotalPrice(
      option?.check_in,
      option?.check_out,
      option?.capacity,
      userId,
    );

    if (respone) {
      setIsLoading(false);
      setProperties(respone);
    }
  };
  useEffect(() => {
    getRoomWithPrice();
  }, []);
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const handleFilterChange = (e) => {
    setIsFilterEnabled(e.target.value === "enable");
  };
  const [properties, setProperties] = useState([]);
  const getProperties = async () => {
    const respone = await getAllProperty();
    setProperties(respone);
  };
  const [position, setPosition] = useState(null);
  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setPosition(initialLocation);
    }
    getProperties();
  }, [initialLocation]);
  const LocationMarker = ({ allowPositionChange }) => {
    useMapEvents({
      click(e) {
        if (!disableClick && (allowPositionChange || !position)) {
          const { lat, lng } = e.latlng;
          setPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
          if (onLocationSelect) {
            onLocationSelect({ lat: parseFloat(lat), lng: parseFloat(lng) });
          }
        }
      },
    });

    return position ? (
      <Marker
        position={position}
        icon={createUserMarkerIcon()}
        eventHandlers={{
          click: (e) => {
            if (disableClick) {
              e.originalEvent.preventDefault();
              e.originalEvent.stopPropagation();
            }
          },
        }}
      >
        <Popup>Your Property</Popup>
      </Marker>
    ) : null;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 1000,
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            {selectedProperty && showPropertyInfo && (
              <>
                <div className="selected-property-container">
                  <div className="selected-property-head">
                    <img
                      src={selectedProperty.value.property_id.images[0]}
                      alt="Property"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="selected-property-name">
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#0c969c",
                        }}
                      >
                        {selectedProperty.value.property_id.name}
                      </p>
                      <p>
                        Rating:{" "}
                        {selectedProperty.value.property_id.rate || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="selected-property-room">
                    <div className="room-information">
                      <p>{selectedProperty.value.name}</p>
                      <p>
                        {selectedProperty.value.capacity.adults}{" "}
                        {selectedProperty.value.capacity.adults > 1
                          ? "adults"
                          : "adult"}
                        , {selectedProperty.value.capacity.childs.count}{" "}
                        {selectedProperty.value.capacity.childs.count > 1
                          ? "children"
                          : "child"}
                      </p>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        {formatCurrency(selectedProperty.totalPriceNight)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(
                          `/property/${selectedProperty.value.property_id._id}`,
                        );
                        setOpenMap(false);
                      }}
                    >
                      View
                    </button>
                  </div>

                  <p>
                    {selectedProperty.value.property_id.address.street},{" "}
                    {selectedProperty.value.property_id.address.ward},{" "}
                    {selectedProperty.value.property_id.address.district},{" "}
                    {selectedProperty.value.property_id.address.province}
                  </p>
                </div>
              </>
            )}
          </div>
          {position && (
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              className={disableClick ? "map-container-disabled" : ""}
              whenCreated={(mapInstance) => {
                if (disableClick) {
                  mapInstance.dragging.disable();
                  mapInstance.touchZoom.disable();
                  mapInstance.doubleClickZoom.disable();
                  mapInstance.scrollWheelZoom.disable();
                  mapInstance.boxZoom.disable();
                  mapInstance.keyboard.disable();
                  mapInstance.off("click");
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker allowPositionChange={allowPositionChange} />
              {properties.map(
                (property) =>
                  property.value && (
                    <Marker
                      key={property.value.property_id.id}
                      position={[
                        property.value.property_id.location.latitude,
                        property.value.property_id.location.longitude,
                      ]}
                      icon={createPropertyMarkerIcon(
                        formatCurrency(property.totalPriceNight),
                      )}
                      eventHandlers={{
                        click: () => setSelectedProperty(property),
                      }}
                    />
                  ),
              )}
            </MapContainer>
          )}
        </>
      )}
    </>
  );
};

export default Map;
