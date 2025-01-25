import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import PropertyCard from "../PropertyCard/PropertyCard"; // Assuming you have a PropertyCard component
import BookingTable from "../BookingTable/BookingTable";

const UserDetail = ({ userData, propertyData, bookingData }) => {
  const {
    _id,
    userName,
    email,
    phoneNumber,
    role,
    address,
    dob,
    isAdmin,
    resetPasswordTokenStatus,
  } = userData;

  const fullAddress = `${address.ward}, ${address.district}, ${address.province}`;

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
          to={`/admin/user/edit/${_id}`}
        >
          Edit
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {userName}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Email: {email}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Phone: {phoneNumber}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Role: {role}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Address: {fullAddress}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Date of Birth: {new Date(dob).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>

      {propertyData && propertyData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Properties Managed by {userName}
          </Typography>
          <Grid container spacing={4}>
            {propertyData.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.property._id}>
                <PropertyCard property={p.property} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* Bookings Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {userName}'s' Bookings
        </Typography>
        <Box sx={{ height: "600px", overflow: "hidden" }}>
          <BookingTable bookings={bookingData} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetail;
