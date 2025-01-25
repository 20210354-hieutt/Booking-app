import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEdit,
  faArrowLeft,
  faHotel,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ImageGallery from "../Image/ImageGallery";

const RoomDetail = ({ roomData }) => {
  const {
    _id,
    name,
    images,
    description,
    property_id,
    rating,
    capacity,
    price_per_night,
    size,
    facility,
  } = roomData;

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faHotel} />}
          component={Link}
          to={`/admin/property/view/${property_id._id}`}
        >
          View In Property
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {property_id.name}
          </Typography>
          {/* <Box display="flex" alignItems="center" mb={1}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 8 }} />
            <Typography variant="subtitle1">{fullAddress}</Typography>
          </Box> */}
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            ⭐ {rating}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Size: {size} m²
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Capacity: {capacity.adults} adults, {capacity.childs.count} child
            (Age: {capacity.childs.age})
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Price per Night:
            <Typography variant="body2" component="span" color="text.primary">
              {price_per_night.weekday}VND (Weekdays),
              {price_per_night.weekend}VND (Weekends)
            </Typography>
          </Typography>
          <Typography variant="body1" paragraph>
            {description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Facilities:
          </Typography>
          <ul>
            {facility.map((item, index) => item && <li key={index}>{item}</li>)}
          </ul>
        </Grid>
        <Grid item xs={12} md={6}>
          {Array.isArray(images) && images.length > 0 ? (
            <ImageGallery images={images} name={name} />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                border: "1px dashed #ccc",
                borderRadius: 2,
                padding: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                No Images Available
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomDetail;
