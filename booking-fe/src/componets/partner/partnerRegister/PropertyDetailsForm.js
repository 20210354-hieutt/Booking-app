import React, { useEffect, useState } from "react";
import Map from "./Map"; // Import the Map component for Google Maps or OpenStreetMap
import "./PropertyDetailsForm.css";
import Slider from "react-slick";
import { getProvince } from "../../../api/addressAPI";
import {
  createPropertyWithPartner,
  getPropertyById,
  getPropertyByOwner,
  updatePropertyWithPartner,
} from "../../../api/propertyAPI";
import { useNavigate } from "react-router-dom";
import { deleteRoomById, findRoomByProperty } from "../../../api/roomAPI";
import { formatCurrency } from "../../../helpers/currencyHelpers";
import { handleSignOut } from "../../../helpers/authHelpers";

const PropertyDetailsForm = ({
  owner,
  longitude,
  latitude,
  initialData,
  type,
  setTab,
  setActiveTab,
}) => {
  const [propertyData, setPropertyData] = useState({
    name: "",
    description: "",
    address: {
      province: "",
      district: "",
      ward: "",
      street: "",
    },
    type: "",
    images: [],
    image: [],
    location: { lat: latitude, lng: longitude },
    rooms: [],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const getAllPropetyByOwner = async (userId) => {
    const data = await getPropertyByOwner(userId, 1, 5);
    setPropertyData(data);
  };
  const handleGetPropertyById = async () => {
    const property = JSON.parse(localStorage.getItem("property"));
    const rooms = await findRoomByProperty(property._id);

    const data = await getPropertyById(property._id);
    if (data) {
      data.rooms = rooms;
      data.location.lat = data.location.latitude;
      data.location.lng = data.location.longitude;
    }
    setPropertyData(data);
    setIsDataLoaded(true);
  };
  if (initialData) {
    setPropertyData(initialData);
  }
  useEffect(() => {
    if (type === "update" && !isDataLoaded) {
      handleGetPropertyById();
    }
  }, [type, isDataLoaded]);
  const navigate = useNavigate();
  const [address, setAddress] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "street") {
      setPropertyData({
        ...propertyData,
        address: {
          ...propertyData.address,
          [name]: value,
        },
      });
    } else {
      setPropertyData({ ...propertyData, [name]: value });
    }
  };

  const handleGetAddress = async () => {
    const respone = await getProvince();
    setAddress(respone);
  };
  const getDistrict = async (code) => {
    const findDistrict = address.find((index) => index.code === parseInt(code));
    
    setDistrict(findDistrict.districts);
  };
  const getWard = async (code) => {
    const findWard = district.find((index) => index.code === parseInt(code));

    setWard(findWard?.wards);
  };
  useEffect(() => {
    handleGetAddress();
  }, []);
  const handleChangeOptions = async (e) => {
    const { name, value } = e.target;
    const selectedOptions = e.target.options[e.target.selectedIndex];
    const code = selectedOptions.getAttribute("data-code");

    if (name === "province") {
      await getDistrict(code);
      setPropertyData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else if (name === "district") {
      await getWard(code);
      setPropertyData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else if (name === "ward") {
      setPropertyData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    }
  };

  const removeRoom = async (index, room) => {
    const updatedRooms = propertyData.rooms.filter((_, i) => i !== index);
    setPropertyData({ ...propertyData, rooms: updatedRooms });
    if (room._id) {
      await deleteRoomById(room._id);
    }
  };
  const handleLocationSelect = (location) => {
    setPropertyData((prevData) => ({
      ...prevData,
      location,
    }));
    setIsMapOpen(false);
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const handleRoomChange = (index, e) => {
    if (e.target.name === "weekday" || e.target.name === "weekend") {
      const rawValue = e.target.value.replace(/,/g, "");
      if (isNaN(rawValue)) return;
      const updatedRooms = [...propertyData.rooms];
      updatedRooms[index] = {
        ...updatedRooms[index],
        price_per_night: {
          ...updatedRooms[index].price_per_night,
          [e.target.name]: rawValue,
        },
      };
      setPropertyData({ ...propertyData, rooms: updatedRooms });
    } else if (e.target.name !== "images") {
      const updatedRooms = [...propertyData.rooms];
      updatedRooms[index] = {
        ...updatedRooms[index],
        [e.target.name]:
          e.target.name === "size" ? parseInt(e.target.value) : e.target.value,
      };
      setPropertyData({ ...propertyData, rooms: updatedRooms });
    }
  };

  const handleRoomImageChange = (index, e) => {
    if (type === "update") {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newImage = [];

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          newImages.push(reader.result);
          newImage.push(file);

          if (newImages.length === files.length) {
            setPropertyData((prevData) => {
              const updatedRooms = [...prevData.rooms];

              updatedRooms[index] = {
                ...updatedRooms[index],
                images: [...newImages],
                image: [...newImage],
              };
              console.log(updatedRooms);

              return {
                ...prevData,
                rooms: updatedRooms,
              };
            });
          }
        };

        reader.readAsDataURL(file);
      });
    } else {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newImage = [];

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          newImages.push(reader.result);
          newImage.push(file);

          if (newImages.length === files.length) {
            setPropertyData((prevData) => {
              const updatedRooms = [...prevData.rooms];

              updatedRooms[index] = {
                ...updatedRooms[index],
                images: [...newImages],
                image: [...newImage],
              };

              return {
                ...prevData,
                rooms: updatedRooms,
              };
            });
          }
        };

        reader.readAsDataURL(file);
      });
    }
  };
  useEffect(() => {
    console.log(propertyData);
  }, [propertyData]);
  const handleRemovePropertyImage = (index) => {
    const updatedImages = propertyData.images.filter((_, i) => i !== index); // Lọc bỏ ảnh theo index
    setPropertyData({
      ...propertyData,
      images: updatedImages,
    });
  };
  const handleRemoveRoomImage = (roomIndex, imageIndex) => {
    setPropertyData((prevData) => {
      const updatedRooms = [...prevData.rooms];

      // Lọc bỏ ảnh theo index cho room tương ứng
      const updatedImages = updatedRooms[roomIndex].images.filter(
        (_, i) => i !== imageIndex,
      );

      // Cập nhật lại mảng images của room
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        images: updatedImages,
      };

      // Cập nhật propertyData với danh sách rooms mới
      return {
        ...prevData,
        rooms: updatedRooms,
      };
    });
  };
  const handlePropertyImageChange = (e) => {
    if (type === "update") {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newImage = [];
      files.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          newImages.push(reader.result);
          newImage.push(file);
          if (newImages.length === files.length) {
            setPropertyData({
              ...propertyData,
              images: [...(propertyData.images || []), ...newImages],
              image: [...(propertyData.image || []), ...newImage],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const files = Array.from(e.target.files);
      
      const newImages = [];
      propertyData.image = files;
      files.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setPropertyData({
              ...propertyData,
              images: newImages,
            });
          }
        };
        reader.readAsDataURL(file);
      });

    }
  };

  const handleRoomCapacityChange = (index, field, value) => {
    const updatedRooms = [...propertyData.rooms];
    if (field === "adults" || field === "room") {
      updatedRooms[index] = {
        ...updatedRooms[index],
        capacity: {
          ...updatedRooms[index].capacity,
          [field]: parseInt(value),
        },
      };
    } else {
      updatedRooms[index] = {
        ...updatedRooms[index],
        capacity: {
          ...updatedRooms[index].capacity,
          childs: {
            ...updatedRooms[index].capacity.childs,

            [field]: parseInt(value),
          },
        },
      };
    }
    setPropertyData({ ...propertyData, rooms: updatedRooms });
  };

  const addRoom = () => {
    setPropertyData({
      ...propertyData,
      rooms: [
        ...propertyData.rooms,
        {
          name: "",
          size: 0,
          images: [],
          image: [],
          capacity: { adults: 0, childs: { count: 0, age: 0 }, room: 0 },
          price_per_night: { weekday: "", weekend: "" },
          rawPricePerNight: {
            weekday: "",
            weekend: "",
          },
        },
      ],
    });
  };
  const updateProperty = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    propertyData.owner_id = userId;
    propertyData.location.longitude = propertyData.location.lng;
    propertyData.location.latitude = propertyData.location.lat;

    setPropertyData({
      ...propertyData,
      rooms: propertyData.rooms.map((room) => ({
        ...room,
        price_per_night: {
          weekday: room.price_per_night.weekday,
          weekend: room.price_per_night.weekend,
        },
      })),
    });
    const formData = new FormData();
    formData.append("_id", propertyData._id);

    formData.append("name", propertyData.name);
    formData.append("owner_id", propertyData.owner_id);

    formData.append("description", propertyData.description);
    formData.append("type", propertyData.type);
    formData.append("location", JSON.stringify(propertyData.location));
    formData.append("address", JSON.stringify(propertyData.address));

    if (Array.isArray(propertyData.images)) {
      propertyData.images.forEach((image, idx) => {
        formData.append(`images[${idx}]`, image);
      });
    } else if (propertyData.images) {
      formData.append("images[0]", propertyData.images);
    }
    if (Array.isArray(propertyData.image)) {
      propertyData.image.forEach((imageFile, idx) => {
        formData.append(`image[${idx}]`, imageFile);
      });
    }
    // Add room details, including each room’s image
    propertyData.rooms.forEach((room, index) => {
      // Append individual room fields
      formData.append(`rooms[${index}][_id]`, room._id);

      formData.append(`rooms[${index}][name]`, room.name);
      formData.append(`rooms[${index}][type]`, room.type);
      formData.append(`rooms[${index}][size]`, room.size);
      formData.append(
        `rooms[${index}][capacity]`,
        JSON.stringify(room.capacity),
      );
      formData.append(
        `rooms[${index}][price_per_night]`,
        JSON.stringify(room.price_per_night),
      );

      // Append room image if available
      if (Array.isArray(room.images)) {
        room.images.forEach((image, imgIdx) => {
          formData.append(`rooms[${index}][images][${imgIdx}]`, image);
        });
      } else if (room.images) {
        // Nếu chỉ có một ảnh (không phải mảng)
        formData.append(`rooms[${index}][images][0]`, room.images);
      }
      if (Array.isArray(room.image)) {
        room.image.forEach((image, imgIdx) => {
          formData.append(`rooms[${index}]image[${imgIdx}]`, image);
        });
      }
    });
    try {
      const property = JSON.parse(localStorage.getItem("property"));

      const respone = await updatePropertyWithPartner(formData, accessToken);
      if (respone) {
        const data = await getPropertyById(property._id);
        const rooms = await findRoomByProperty(property._id);

        if (data) {
          data.rooms = rooms;
          data.location.lat = data.location.latitude;
          data.location.lng = data.location.longitude;
        }
    setPropertyData(data);
        setTab("info");
      }
    } catch (error) {
      console.log(error);
      
      if(error.response.status === 401){
        await handleSignOut()    
        navigate('/login')    
      }
    }
  };
  const addProperty = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    propertyData.owner_id = userId;
    propertyData.location.longitude = propertyData.location.lng;
    propertyData.location.latitude = propertyData.location.lat;
    setPropertyData({
      ...propertyData,
      rooms: propertyData.rooms.map((room) => ({
        ...room,
        price_per_night: {
          weekday: room.price_per_night.weekday,
          weekend: room.price_per_night.weekend,
        },
      })),
    });
    
    const formData = new FormData();

    formData.append("_id", propertyData._id);

    formData.append("name", propertyData.name);
    formData.append("owner_id", propertyData.owner_id);

    formData.append("description", propertyData.description);
    formData.append("type", propertyData.type);
    formData.append("location", JSON.stringify(propertyData.location));
    formData.append("address", JSON.stringify(propertyData.address));

    if (Array.isArray(propertyData.images)) {
      propertyData.images.forEach((image, idx) => {
        formData.append(`images[${idx}]`, image);
      });
    } else if (propertyData.images) {
      formData.append("images[0]", propertyData.images);
    }
    if (Array.isArray(propertyData.image)) {
      propertyData.image.forEach((imageFile, idx) => {
        formData.append(`image[${idx}]`, imageFile);
      });
    }

    propertyData.rooms.forEach((room, index) => {
      formData.append(`rooms[${index}][name]`, room.name);
      formData.append(`rooms[${index}][type]`, room.type);
      formData.append(`rooms[${index}][size]`, room.size);
      formData.append(
        `rooms[${index}][capacity]`,
        JSON.stringify(room.capacity),
      );
      formData.append(
        `rooms[${index}][price_per_night]`,
        JSON.stringify(room.price_per_night),
      );

      if (Array.isArray(room.images)) {
        room.images.forEach((image, imgIdx) => {
          formData.append(`rooms[${index}][images][${imgIdx}]`, image);
        });
      } else if (room.images) {
        formData.append(`rooms[${index}][images][0]`, room.images);
      }
      if (Array.isArray(room.image)) {
        room.image.forEach((image, imgIdx) => {
          formData.append(`rooms[${index}]image[${imgIdx}]`, image);
        });
      }
    });
    try {
      const respone = await createPropertyWithPartner(formData, accessToken);
      getAllPropetyByOwner(userId);
      setActiveTab("list");
      console.log(formData)
    } catch (error) {
      console.error("Failed to add property:", error);
    }
  };

  return (
    <>
      {address && propertyData && propertyData.rooms && (
        <div
          className={`property-details-container ${type === "update" && "update-form"}`}
        >
          <div className="property-details-form">
            <h2>Add Property Details</h2>
            <form className="form-sectionn">
              <div className="container-left">
                <label>Property Name</label>
                <input
                  type="text"
                  name="name"
                  value={propertyData.name}
                  onChange={handleChange}
                  required
                />
                <label>Property Image</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={(e) => handlePropertyImageChange(e)}
                  required
                />
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={propertyData.address.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="container-right">
                <label>Province</label>
                <select
                  id="province"
                  name="province"
                  onChange={handleChangeOptions}
                  required
                >
                  <option value="">Tỉnh/Thành phố</option>
                  {address.map((index) => (
                    <option data-code={index.code} value={index.name}>
                      {index.name}
                    </option>
                  ))}
                </select>

                <label>District</label>
                <select
                  id="district"
                  name="district"
                  onChange={handleChangeOptions}
                >
                  <option value="">Quận/Huyện</option>
                  {district?.map((index) => (
                    <option
                      data-code={index.code}
                      value={index.name}
                      id={index.code}
                    >
                      {index.name}
                    </option>
                  ))}
                </select>

                <label>Ward</label>
                <select id="ward" name="ward" onChange={handleChangeOptions}>
                  <option value="">Phường/Xã</option>
                  {ward?.map((index) => (
                    <option
                      data-code={index.code}
                      value={index.name}
                      id={index.code}
                    >
                      {index.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <label>Description</label>
              <textarea
                name="description"
                value={propertyData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="room-section">
              {propertyData.rooms.map((room, index) => (
                <>
                  <div key={index} className="form-sectionn">
                    <div className="container-left">
                      <h3>Rooms</h3>

                      <label>Room Name</label>
                      <input
                        type="text"
                        name="name"
                        value={room.name}
                        onChange={(e) => handleRoomChange(index, e)}
                        required
                      />

                      <label>Available Rooms</label>
                      <input
                        type="number"
                        name="room"
                        value={room.capacity.room}
                        onChange={(e) =>
                          handleRoomCapacityChange(
                            index,
                            e.target.name,
                            e.target.value,
                          )
                        }
                        required
                      />
                      <label>Room Size</label>
                      <input
                        type="number"
                        name="size"
                        value={room.size}
                        onChange={(e) => handleRoomChange(index, e)}
                      />

                      <label>Number of Adults</label>
                      <input
                        type="number"
                        name="adults"
                        value={room.capacity.adults}
                        onChange={(e) =>
                          handleRoomCapacityChange(
                            index,
                            e.target.name,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="container-right">
                      <h3 style={{}}>Price Per Night</h3>
                      <label>
                        Weekday Price:{" "}
                        {formatCurrency(room.price_per_night.weekday)}
                      </label>

                      <input
                        type="number"
                        name="weekday"
                        value={
                          propertyData.rooms[index].price_per_night.weekday
                        }
                        onChange={(e) => handleRoomChange(index, e)}
                        required
                      />

                      <label>
                        Weekend Price:{" "}
                        {formatCurrency(room.price_per_night.weekend)}
                      </label>

                      <input
                        type="number"
                        name="weekend"
                        value={
                          propertyData.rooms[index].price_per_night.weekend
                        }
                        onChange={(e) => handleRoomChange(index, e)}
                        required
                      />
                      <label>Age of Child</label>
                      <input
                        type="number"
                        name="age"
                        value={room.capacity.childs.age}
                        onChange={(e) =>
                          handleRoomCapacityChange(
                            index,
                            e.target.name,
                            e.target.value,
                          )
                        }
                      />
                      <label>Number of Child</label>
                      <input
                        type="number"
                        name="count"
                        value={room.capacity.childs.count}
                        onChange={(e) =>
                          handleRoomCapacityChange(
                            index,
                            e.target.name,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>Room Image</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleRoomImageChange(index, e)}
                    />
                  </div>
                  {propertyData.rooms.length !== 0 && (
                    <>
                      <div key={index}>
                        <h3>Room {index + 1}</h3>
                        {room.images &&
                          room.images.length > 0 &&
                          (room.images.length > 1 ? (
                            <Slider
                              dots={true}
                              infinite={true}
                              speed={500}
                              slidesToShow={1}
                              slidesToScroll={1}
                            >
                              {room.images.map((image, imgidx) => (
                                <div
                                  key={`${index}-${imgidx}`}
                                  style={{
                                    position: "relative",
                                    overflow: "visible",
                                  }}
                                >
                                  <img
                                    src={image}
                                    alt={`Room ${index + 1} preview ${imgidx}`}
                                    style={{ width: "100%", height: "auto" }}
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemoveRoomImage(index, imgidx)
                                    }
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                      backgroundColor: "rgba(255, 0, 0, 0.8)",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      fontSize: "16px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                                      zIndex: 10000,
                                    }}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            // Nếu chỉ có 1 ảnh, hiển thị ảnh đơn giản
                            <div style={{ position: "relative" }}>
                              <img
                                src={room.images[0]}
                                alt={`Room ${index + 1} preview`}
                                style={{ width: "100%", height: "auto" }}
                              />
                              <button
                                onClick={() => handleRemoveRoomImage(index, 0)}
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  backgroundColor: "rgba(255, 0, 0, 0.8)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                                  zIndex: 10000,
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    className="remove-room-button"
                    onClick={() => removeRoom(index, room)}
                  >
                    Remove Room
                  </button>
                </>
              ))}

              <button
                type="button"
                className="add-room-button"
                onClick={addRoom}
              >
                Add Room
              </button>
            </div>
            <button
              type="button"
              className="add-property-button"
              onClick={type === "update" ? updateProperty : addProperty}
            >
              {type === "update" ? "Update Property" : "Add Property"}
            </button>
          </div>

          <div className="container-map">
            <h3>Property Summary</h3>
            <p>
              <strong>Name:</strong> {propertyData.name}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${propertyData.address.street}, ${propertyData.address.ward}, ${propertyData.address.district}, ${propertyData.address.province}`}
            </p>
            <p>
              <strong>Description:</strong> {propertyData.description}
            </p>
            <p>
              <strong>Latitude:</strong> {propertyData.location.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {propertyData.location.lng}
            </p>
            <p>
              <strong>Property's Image:</strong>
            </p>

            {propertyData.images &&
              (propertyData.images.length > 1 ? (
                <div
                  className="image-slider"
                  style={{ overflow: "visible", position: "relative" }}
                >
                  <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                  >
                    {propertyData.images.map((image, idx) => (
                      <div key={idx}>
                        <img
                          src={image}
                          alt={`Property preview ${idx}`}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <button
                          onClick={() => handleRemovePropertyImage(idx)}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            fontSize: "16px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                            zIndex: 10000, // Đặt z-index cực cao để nút nằm trên cùng
                          }}
                        >
                          &times; {/* Dấu x */}
                        </button>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div>
                  <img
                    src={propertyData.images[0]}
                    all={"Property Image Review"}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <button
                    onClick={() => handleRemovePropertyImage(0)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "rgba(255, 0, 0, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                      zIndex: 10000, // Đặt z-index cực cao để nút nằm trên cùng
                    }}
                  >
                    &times; {/* Dấu x */}
                  </button>
                </div>
              ))}

            <div className="mini-mapp">
              <button
                className={type === "update" ? "open-map-buttonn" : "open-map-buttonnn"}
                onClick={() => setIsMapOpen(true)}
              >
                Open Map
              </button>
              <Map
                key={`${propertyData.location.lat}-${propertyData.location.lng}`}
                onLocationSelect={() => {}}
                initialLocation={propertyData.location}
              />
            </div>
          </div>

          {/* Map Pop-up Modal */}
          {isMapOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="circle-close-button"
                  onClick={() => setIsMapOpen(false)}
                >
                  &times;
                </button>
                <Map
                  onLocationSelect={handleLocationSelect}
                  initialLocation={propertyData.location}
                  disableClick={false}
                  allowPositionChange={true}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyDetailsForm;
