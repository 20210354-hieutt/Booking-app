// RoomForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const RoomForm = ({ initialData, onSubmit, formTitle }) => {
  const [roomData, setRoomData] = useState({
    _id: initialData._id || "",
    name: initialData.name || "",
    type: initialData.type || "",
    size: initialData.size || "",
    capacity: initialData.capacity || {
      adults: "",
      childs: {
        count: "",
        age: "",
      },
    },
    price_per_night: initialData.price_per_night || {
      weekday: "",
      weekend: "",
    },
    images: initialData.images || [],
    imageFiles: initialData.imageFiles || [], // For File objects
  });

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("Room Data Updated:", roomData);
  }, [roomData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("capacity.")) {
      const field = name.split(".")[1];
      setRoomData((prevData) => ({
        ...prevData,
        capacity: {
          ...prevData.capacity,
          [field]: value,
        },
      }));
    } else if (name.startsWith("price_per_night.")) {
      const field = name.split(".")[1];
      setRoomData((prevData) => ({
        ...prevData,
        price_per_night: {
          ...prevData.price_per_night,
          [field]: value,
        },
      }));
    } else {
      setRoomData((prevData) => ({
        ...prevData,
        [name]: name === "size" ? parseInt(value, 10) || "" : value,
      }));
    }
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newImageFiles = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push(reader.result); // For preview
        newImageFiles.push(file); // For upload

        if (newImages.length === files.length) {
          setRoomData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...newImages],
            imageFiles: [...prevData.imageFiles, ...newImageFiles],
          }));
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setRoomData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      const updatedImageFiles = prevData.imageFiles.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        images: updatedImages,
        imageFiles: updatedImageFiles,
      };
    });
  };

  // Validate form
  const validateForm = () => {
    if (!roomData.name.trim()) return "Room name is required.";
    if (!roomData.type.trim()) return "Room type is required.";
    if (!roomData.size) return "Room size is required.";
    if (
      !roomData.capacity.adults &&
      !roomData.capacity.childs.count &&
      !roomData.capacity.childs.age
    )
      return "At least one capacity field is required.";
    if (
      !roomData.price_per_night.weekday.trim() &&
      !roomData.price_per_night.weekend.trim()
    )
      return "At least one price field is required.";

    return null;
  };

  // Handle form submission
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

    // Append room fields
    if (roomData._id) {
      formData.append("_id", roomData._id);
    }
    formData.append("name", roomData.name);
    formData.append("type", roomData.type);
    formData.append("size", roomData.size);
    formData.append("capacity", JSON.stringify(roomData.capacity));
    formData.append(
      "price_per_night",
      JSON.stringify(roomData.price_per_night)
    );

    // Append images
    roomData.imageFiles.forEach((file, idx) => {
      formData.append(`images[${idx}]`, file);
    });

    // Debugging: Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      await onSubmit(formData, roomData._id);
      setSuccess(true);
      // Optionally reset the form after successful submission
      // setRoomData({
      //   _id: "",
      //   name: "",
      //   type: "",
      //   size: "",
      //   capacity: { adults: "", childs: { count: "", age: "" } },
      //   price_per_night: { weekday: "", weekend: "" },
      //   images: [],
      //   imageFiles: [],
      // });
    } catch (err) {
      console.error("Error submitting room form:", err);
      setSubmitError(
        err.message || "Failed to submit the room. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 3,
        mb: 4,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {formTitle || "Room Form"}
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Room submitted successfully!
        </Alert>
      )}

      {/* Room Name */}
      <TextField
        label="Room Name"
        variant="outlined"
        fullWidth
        margin="normal"
        name="name"
        value={roomData.name}
        onChange={handleInputChange}
        required
      />

      {/* Room Type */}
      <TextField
        select
        label="Room Type"
        variant="outlined"
        fullWidth
        margin="normal"
        name="type"
        value={roomData.type}
        onChange={handleInputChange}
        required
      >
        {["single", "double", "suite"].map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      {/* Room Size */}
      <TextField
        label="Room Size (sq ft)"
        variant="outlined"
        fullWidth
        margin="normal"
        name="size"
        type="number"
        value={roomData.size}
        onChange={handleInputChange}
        required
      />

      {/* Price per Night */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price per Night (Weekday)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="price_per_night.weekday"
            value={roomData.price_per_night.weekday}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price per Night (Weekend)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="price_per_night.weekend"
            value={roomData.price_per_night.weekend}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      {/* Capacity */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Capacity
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Adults"
            variant="outlined"
            fullWidth
            margin="normal"
            name="capacity.adults"
            type="number"
            value={roomData.capacity.adults}
            onChange={handleInputChange}
            required
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
            value={roomData.capacity.childs.count}
            onChange={handleInputChange}
            required
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
            value={roomData.capacity.childs.age}
            onChange={handleInputChange}
            required
          />
        </Grid>
      </Grid>

      {/* Room Images */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Room Images
        </Typography>
        <Grid container spacing={2}>
          {roomData.images.map((imgUrl, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "75%", // 4:3 aspect ratio
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Room Image ${index + 1}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                  loading="lazy"
                />
                <IconButton
                  aria-label="remove image"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
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

          <Grid item xs={12} sm={4}>
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
                onChange={handleImageChange}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Room"}
      </Button>
    </Box>
  );
};

RoomForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    capacity: PropTypes.shape({
      adults: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      childs: PropTypes.shape({
        count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    }),
    price_per_night: PropTypes.shape({
      weekday: PropTypes.string,
      weekend: PropTypes.string,
    }),
    images: PropTypes.arrayOf(PropTypes.string),
    imageFiles: PropTypes.arrayOf(PropTypes.object), // For File objects
  }),
  onSubmit: PropTypes.func.isRequired, // Function to handle form submission
  formTitle: PropTypes.string,
};

RoomForm.defaultProps = {
  initialData: {
    _id: "",
    name: "",
    type: "",
    size: "",
    capacity: { adults: "", childs: { count: "", age: "" } },
    price_per_night: { weekday: "", weekend: "" },
    images: [],
    imageFiles: [],
  },
  formTitle: "Room Form",
};

export default RoomForm;
