import React from "react";
import { Box, Grid, Typography, Button, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ImageGallery from "../Image/ImageGallery";
import PropTypes from "prop-types";
import RoomCard from "../RoomCard/RoomCard";

const AdminPropertyDetail = ({ propertyData, roomData }) => {
  const {
    _id,
    name,
    property_type,
    address,
    owner_id,
    images,
    description,
    rate,
  } = propertyData;

  const fullAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;
  const ownerName = owner_id ? owner_id.userName : "No Owner";
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
          startIcon={<FontAwesomeIcon icon={faEdit} />}
          component={Link}
          to={`/admin/property/edit/${_id}`}
        >
          Edit
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {property_type}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 8 }} />
            <Typography variant="subtitle1">{fullAddress}</Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            ⭐ {rate}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Owner: {ownerName}
          </Typography>

          <Typography variant="body1" paragraph>
            {description}
          </Typography>
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

      {/* Rooms Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Rooms Available
        </Typography>
        <Grid container spacing={4}>
          {roomData && roomData.length > 0 ? (
            roomData.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room._id}>
                <RoomCard room={room} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                No rooms available for this property.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPropertyDetail;
