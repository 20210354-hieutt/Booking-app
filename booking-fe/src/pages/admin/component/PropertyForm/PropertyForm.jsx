import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getProvince } from "../../../../api/addressAPI";
import LeafletMap from "../Map/LeafletMap";
import PropTypes from "prop-types";
import { getPartner } from "../../../../api/userAPI";

const PropertyForm = ({ initialData, onSubmit, formTitle }) => {
  const normalizedRooms = (initialData.rooms || []).map((room) => ({
    ...room,
    images: Array.isArray(room.images) ? room.images : [],
    image: Array.isArray(room.image) ? room.image : [],
    capacity: room.capacity || {
      adults: 0,
      childs: { count: 0, age: 0 },
      room: 0,
    },
    price_per_night: room.price_per_night || { weekday: "", weekend: "" },
  }));

  const [propertyData, setPropertyData] = useState({
    _id: initialData._id || "",
    name: initialData.name || "",
    description: initialData.description || "",
    address: {
      province: initialData.address?.province || "",
      district: initialData.address?.district || "",
      ward: initialData.address?.ward || "",
      street: initialData.address?.street || "",
      provinceCode: initialData.address?.provinceCode || "",
      districtCode: initialData.address?.districtCode || "",
      wardCode: initialData.address?.wardCode || "",
    },
    type: initialData.property_type || "",
    images: Array.isArray(initialData.images) ? initialData.images : [],
    image: Array.isArray(initialData.image) ? initialData.image : [],
    location: {
      latitude: initialData.location?.latitude || 0,
      longitude: initialData.location?.longitude || 0,
      lat: initialData.location?.latitude || 0,
      lng: initialData.location?.longitude || 0,
    },
    rooms: normalizedRooms,
    owner_id: initialData.owner_id?._id || localStorage.getItem("userId") || "",
  });

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [addressData, setAddressData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [openMapDialog, setOpenMapDialog] = useState(false);

  const [loadingAddressData, setLoadingAddressData] = useState(false);

  const [partners, setPartners] = useState([]); // Store partners data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  // Function to fetch partners from the API
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const data = await getPartner(accessToken);
      console.log({ data });
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };
  const roomType = ["single", "double", "suite"];

  const propertyTypes = [
    "Hotel",
    "Apartment",
    "Hostel",
    "Resort",
    "Lodge",
    "Homestay",
    "Villa",
    "Penthouse",
    "Bungalow",
  ];
  useEffect(() => {
    console.log("Property Data Updated:", propertyData);
  }, [propertyData]);
  // Fetch provinces on mount
  useEffect(() => {
    fetchAddressData();
    // Initialize districts and wards based on initialData
    if (initialData.address?.provinceCode && addressData.length > 0) {
      const selectedProvince = addressData.find(
        (p) => p.code === initialData.address.provinceCode
      );
      setDistricts(selectedProvince?.districts || []);
      if (initialData.address.districtCode) {
        const selectedDistrict = selectedProvince?.districts.find(
          (d) => d.code === initialData.address.districtCode
        );
        setWards(selectedDistrict?.wards || []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchAddressData = async () => {
    setLoadingAddressData(true);
    try {
      const response = await getProvince();
      setAddressData(response);
      // If updating, set districts and wards based on initialData
      if (initialData.address?.provinceCode) {
        const selectedProvince = response.find(
          (p) => p.code === initialData.address.provinceCode
        );
        setDistricts(selectedProvince?.districts || []);
        if (initialData.address.districtCode) {
          const selectedDistrict = selectedProvince?.districts.find(
            (d) => d.code === initialData.address.districtCode
          );
          setWards(selectedDistrict?.wards || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    } finally {
      setLoadingAddressData(false);
    }
  };
  const handleOwnerChange = (e) => {
    const selectedOwnerId = e.target.value;
    setPropertyData((prevData) => ({
      ...prevData,
      owner_id: selectedOwnerId,
    }));
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const code = value ? parseInt(value) : "";

    if (name === "province") {
      const selectedProvince = addressData.find((p) => p.code === code);
      setDistricts(selectedProvince?.districts || []);
      setWards([]);
      setPropertyData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          province: selectedProvince ? selectedProvince.name : "",
          provinceCode: code || "",
          district: "",
          districtCode: "",
          ward: "",
          wardCode: "",
        },
      }));
    } else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.code === code);
      setWards(selectedDistrict?.wards || []);
      setPropertyData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          district: selectedDistrict ? selectedDistrict.name : "",
          districtCode: code || "",
          ward: "",
          wardCode: "",
        },
      }));
    } else if (name === "ward") {
      const selectedWard = wards.find((w) => w.code === code);
      setPropertyData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          ward: selectedWard ? selectedWard.name : "",
          wardCode: code || "",
        },
      }));
    } else {
      setPropertyData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!propertyData.name.trim()) return "Property name is required.";
    if (!propertyData.description.trim()) return "Description is required.";
    if (!propertyData.type.trim()) return "Property type is required.";
    if (!propertyData.address.street.trim()) return "Street is required.";
    if (!propertyData.address.ward.trim()) return "Ward is required.";
    if (!propertyData.address.district.trim()) return "District is required.";
    if (!propertyData.address.province.trim()) return "Province is required.";
    if (propertyData.location.lat === 0 || propertyData.location.lng === 0)
      return "Location must be selected on the map.";

    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const formData = new FormData();

    // Append property fields
    if (propertyData._id) {
      formData.append("_id", propertyData._id);
    }
    formData.append("name", propertyData.name);
    formData.append("owner_id", propertyData.owner_id);
    formData.append("description", propertyData.description);
    formData.append("property_type", propertyData.type);
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
      if (room._id) {
        // Only append if _id exists
        formData.append(`rooms[${index}][_id]`, room._id);
      }

      formData.append(`rooms[${index}][name]`, room.name);
      formData.append(`rooms[${index}][type]`, room.type);
      formData.append(`rooms[${index}][size]`, room.size);
      formData.append(
        `rooms[${index}][capacity]`,
        JSON.stringify(room.capacity)
      );
      formData.append(
        `rooms[${index}][price_per_night]`,
        JSON.stringify(room.price_per_night)
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

    // Debugging: Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      await onSubmit(formData, propertyData._id);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(
        err.message || "Failed to submit the form. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Image Handlers
  const handlePropertyImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newImageFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push(reader.result); // For preview
        newImageFiles.push(file); // For upload

        if (newImages.length === files.length) {
          setPropertyData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...newImages],
            image: [...prevData.image, ...newImageFiles],
          }));
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemovePropertyImage = (index) => {
    setPropertyData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      const updatedImageFiles = prevData.image.filter((_, i) => i !== index);
      return {
        ...prevData,
        images: updatedImages,
        image: updatedImageFiles,
      };
    });
  };

  // Room Handlers
  const handleAddRoom = () => {
    setPropertyData((prevData) => ({
      ...prevData,
      rooms: [
        ...prevData.rooms,
        {
          _id: "", // To be set if updating
          name: "",
          type: "",
          size: 0,
          images: [],
          image: [],
          capacity: { adults: 0, childs: { count: 0, age: 0 }, room: 0 },
          price_per_night: { weekday: "", weekend: "" },
        },
      ],
    }));
  };

  const handleRemoveRoom = (index) => {
    setPropertyData((prevData) => {
      const updatedRooms = prevData.rooms.filter((_, i) => i !== index);
      return { ...prevData, rooms: updatedRooms };
    });
  };

  const handleRoomChange = (e, index) => {
    const { name, value } = e.target;

    setPropertyData((prevData) => {
      const updatedRooms = [...prevData.rooms];
      const room = { ...updatedRooms[index] };

      if (name.startsWith("price_per_night.")) {
        const field = name.split(".")[1];
        room.price_per_night = {
          ...room.price_per_night,
          [field]: value,
        };
      } else if (name.startsWith("capacity.")) {
        const field = name.split(".")[1];
        if (field === "childrenCount" || field === "childrenAge") {
          room.capacity.childs = {
            ...room.capacity.childs,
            [field === "childrenCount" ? "count" : "age"]: parseInt(value),
          };
        } else {
          room.capacity = {
            ...room.capacity,
            [field]: parseInt(value),
          };
        }
      } else {
        room[name] = name === "size" ? parseInt(value) : value;
      }

      updatedRooms[index] = room;
      return { ...prevData, rooms: updatedRooms };
    });
  };

  const handleNestedRoomChange = (e, index, parentKey) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setPropertyData((prevData) => {
      const updatedRooms = [...prevData.rooms];
      let current = updatedRooms[index];
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      updatedRooms[index] = { ...updatedRooms[index] };
      return { ...prevData, rooms: updatedRooms };
    });
  };

  const handleRoomImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newImageFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push(reader.result);
        newImageFiles.push(file);

        if (newImages.length === files.length) {
          setPropertyData((prevData) => {
            const updatedRooms = [...prevData.rooms];
            const room = updatedRooms[index];
            if (!Array.isArray(room.image)) {
              room.image = [];
            }

            updatedRooms[index] = {
              ...room,
              images: [...room.images, ...newImages],
              image: [...room.image, ...newImageFiles],
            };
            return { ...prevData, rooms: updatedRooms };
          });
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveRoomImage = (roomIndex, imageIndex) => {
    setPropertyData((prevData) => {
      const updatedRooms = [...prevData.rooms];
      const updatedImages = updatedRooms[roomIndex].images.filter(
        (_, i) => i !== imageIndex
      );
      const updatedImageFiles = updatedRooms[roomIndex].image.filter(
        (_, i) => i !== imageIndex
      );
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        images: updatedImages,
        image: updatedImageFiles,
      };
      return { ...prevData, rooms: updatedRooms };
    });
  };

  // Location Handler
  const handleMapClick = (location) => {
    setPropertyData((prevData) => ({
      ...prevData,
      location: {
        lat: location.lat,
        lng: location.lng,
        latitude: location.lat,
        longitude: location.lng,
      },
    }));
    setOpenMapDialog(false);
  };

  // Cleanup Object URLs
  useEffect(() => {
    return () => {
      propertyData.images.forEach((img) => {
        if (img.startsWith("blob:")) {
          URL.revokeObjectURL(img);
        }
      });
      propertyData.rooms.forEach((room) => {
        room.images.forEach((img) => {
          if (img.startsWith("blob:")) {
            URL.revokeObjectURL(img);
          }
        });
      });
    };
  }, [propertyData.images, propertyData.rooms]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {formTitle || "Property Form"}
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit}>
        {/* Property Name */}
        <TextField
          label="Property Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={propertyData.name}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={propertyData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />

        {/* Property Type */}
        <TextField
          select
          label="Property Type"
          variant="outlined"
          fullWidth
          margin="normal"
          name="type"
          value={propertyData.type}
          onChange={handleChange}
          required
        >
          {propertyTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* Address Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Address
        </Typography>

        {/* Province */}
        <TextField
          label="Province"
          variant="outlined"
          fullWidth
          margin="normal"
          name="province"
          value={propertyData.address.provinceCode || ""}
          onChange={handleAddressChange}
          select
          required
        >
          {loadingAddressData ? (
            <MenuItem value="">
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            addressData.map((province) => (
              <MenuItem key={province.code} value={province.code}>
                {province.name}
              </MenuItem>
            ))
          )}
        </TextField>

        {/* District */}
        <TextField
          label="District"
          variant="outlined"
          fullWidth
          margin="normal"
          name="district"
          value={propertyData.address.districtCode || ""}
          onChange={handleAddressChange}
          select
          required
          disabled={!propertyData.address.provinceCode}
        >
          {districts.length === 0 ? (
            <MenuItem value="">
              {propertyData.address.provinceCode ? (
                <CircularProgress size={24} />
              ) : (
                "Please select a province first"
              )}
            </MenuItem>
          ) : (
            districts.map((district) => (
              <MenuItem key={district.code} value={district.code}>
                {district.name}
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Ward */}
        <TextField
          label="Ward"
          variant="outlined"
          fullWidth
          margin="normal"
          name="ward"
          value={propertyData.address.wardCode || ""}
          onChange={handleAddressChange}
          select
          required
          disabled={!propertyData.address.districtCode}
        >
          {wards.length === 0 ? (
            <MenuItem value="">
              {propertyData.address.districtCode ? (
                <CircularProgress size={24} />
              ) : (
                "Please select a district first"
              )}
            </MenuItem>
          ) : (
            wards.map((ward) => (
              <MenuItem key={ward.code} value={ward.code}>
                {ward.name}
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Street */}
        <TextField
          label="Street"
          variant="outlined"
          fullWidth
          margin="normal"
          name="street"
          value={propertyData.address.street}
          onChange={handleAddressChange}
          required
        />

        {/* Owner Select Field */}
        <TextField
          label="Owner"
          variant="outlined"
          fullWidth
          margin="normal"
          value={propertyData.owner_id}
          onChange={handleOwnerChange}
          select
          disabled={loading} // Disable select if data is still loading
        >
          {partners.map((partner) => (
            <MenuItem key={partner._id} value={partner._id}>
              {partner.userName}
            </MenuItem>
          ))}
        </TextField>

        {/* Property Images */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Property Images
          </Typography>
          <Grid container spacing={2}>
            {propertyData.images.map((imageUrl, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    overflow: "visible",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Property ${index + 1}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                  <IconButton
                    aria-label="remove image"
                    onClick={() => handleRemovePropertyImage(index)}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 24,
                      height: 24,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                      borderRadius: "50%",
                      padding: 0,
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} color="#f44336" size="sm" />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  width: "100%",
                  height: "100%",
                  padding: 0,
                  borderRadius: 2,
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "text.secondary",
                  minHeight: 150,
                }}
              >
                <FontAwesomeIcon icon={faPlus} size="2x" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Upload Images
                </Typography>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handlePropertyImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Rooms Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Rooms
          </Typography>
          {propertyData.rooms.map((room, index) => (
            <Box
              key={room._id || index}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                mb: 2,
                position: "relative",
              }}
            >
              <IconButton
                aria-label="remove room"
                onClick={() => handleRemoveRoom(index)}
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -16,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <FontAwesomeIcon icon={faTimes} color="#f44336" />
              </IconButton>

              {/* Room Name */}
              <TextField
                label="Room Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={room.name}
                onChange={(e) => handleRoomChange(e, index)}
                required
              />

              {/* Room Type */}
              {/* <TextField
                select
                label="Room Type"
                variant="outlined"
                fullWidth
                margin="normal"
                name="type"
                value={room.type}
                onChange={(e) => handleRoomChange(e, index)}
              >
                {roomType.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField> */}

              {/* Room Size */}
              <TextField
                label="Room Size (sq ft)"
                variant="outlined"
                fullWidth
                margin="normal"
                name="size"
                type="number"
                value={room.size}
                onChange={(e) => handleRoomChange(e, index)}
                required
              />

              {/* Price per Night */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price per Night (Weekday)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="price_per_night.weekday"
                    value={room.price_per_night.weekday}
                    onChange={(e) =>
                      handleNestedRoomChange(e, index, "price_per_night")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price per Night (Weekend)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="price_per_night.weekend"
                    value={room.price_per_night.weekend}
                    onChange={(e) =>
                      handleNestedRoomChange(e, index, "price_per_night")
                    }
                  />
                </Grid>
              </Grid>

              {/* Capacity */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Adults Capacity"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="capacity.adults"
                    type="number"
                    value={room.capacity.adults}
                    onChange={(e) =>
                      handleNestedRoomChange(e, index, "capacity")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Children Count"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="capacity.childs.count"
                    type="number"
                    value={room.capacity.childs.count}
                    onChange={(e) =>
                      handleNestedRoomChange(e, index, "capacity")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Children Age"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="capacity.childs.age"
                    type="number"
                    value={room.capacity.childs.age}
                    onChange={(e) =>
                      handleNestedRoomChange(e, index, "capacity")
                    }
                  />
                </Grid>
              </Grid>

              {/* Room Images */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Room Images</Typography>
                <Grid container spacing={2}>
                  {room.images.map((imgUrl, imgIndex) => (
                    <Grid item xs={4} key={imgIndex}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          paddingTop: "75%",
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Room ${index + 1} ${imgIndex + 1}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          loading="lazy"
                        />
                        <IconButton
                          aria-label="remove room image"
                          onClick={() => handleRemoveRoomImage(index, imgIndex)}
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            width: 24,
                            height: 24,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            borderRadius: "50%",
                            padding: 0,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            color="#f44336"
                            size="sm"
                          />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}

                  <Grid item xs={4}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: "100%",
                        height: "100%",
                        padding: 0,
                        borderRadius: 2,
                        textTransform: "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "text.secondary",
                        minHeight: 100,
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} size="2x" />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Upload Images
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={(e) => handleRoomImageChange(index, e)}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAddRoom}
          >
            Add Room
          </Button>
        </Box>

        {/* Property Location */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Property Location
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
            onClick={() => setOpenMapDialog(true)}
          >
            {propertyData.location.lat && propertyData.location.lng
              ? "Update Location"
              : "Select Location on Map"}
          </Button>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {/* Map Dialog */}
      <Dialog
        open={openMapDialog}
        onClose={() => setOpenMapDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Property Location</DialogTitle>
        <DialogContent>
          <LeafletMap
            initialLocation={propertyData.location}
            onLocationSelect={handleMapClick}
            height="500px"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMapDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message={
          initialData._id
            ? "Property updated successfully!"
            : "Property created successfully!"
        }
      />
    </Box>
  );
};

PropertyForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.shape({
      province: PropTypes.string,
      district: PropTypes.string,
      ward: PropTypes.string,
      street: PropTypes.string,
      provinceCode: PropTypes.number,
      districtCode: PropTypes.number,
      wardCode: PropTypes.number,
    }),
    type: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.arrayOf(PropTypes.object), // For File objects
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.arrayOf(PropTypes.object), // For File objects
        capacity: PropTypes.shape({
          adults: PropTypes.number,
          childs: PropTypes.shape({
            count: PropTypes.number,
            age: PropTypes.number,
          }),
          room: PropTypes.number,
        }),
        price_per_night: PropTypes.shape({
          weekday: PropTypes.string,
          weekend: PropTypes.string,
        }),
      })
    ),
    owner_id: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired, // Function to handle form submission
  formTitle: PropTypes.string,
};

PropertyForm.defaultProps = {
  initialData: {
    _id: "",
    name: "",
    description: "",
    address: {
      province: "",
      district: "",
      ward: "",
      street: "",
      provinceCode: "",
      districtCode: "",
      wardCode: "",
    },
    type: "",
    images: [],
    image: [],
    location: { lat: 0, lng: 0 },
    rooms: [],
    owner_id: "",
  },
  formTitle: "Property Form",
};

export default PropertyForm;
