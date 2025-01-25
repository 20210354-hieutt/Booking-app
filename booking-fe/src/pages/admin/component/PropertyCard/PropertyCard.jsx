import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PropertyCard = ({ property }) => {
  const propertyId = property._id;

  // Define a placeholder image URL
  const placeholderImage =
    "https://via.placeholder.com/280x90.png?text=No+Image";

  // Safely access the first image or use the placeholder
  const propertyImage =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : placeholderImage;

  return (
    <Card
      component={Link}
      to={`/admin/property/view/${propertyId}`}
      sx={{
        width: 280, // Fixed width
        height: 170, // Fixed height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          boxShadow: 6,
        },
        position: "relative", // Allow positioning elements within the card
      }}
    >
      <CardMedia
        component="img"
        height="90" // Fixed height for the image
        image={propertyImage}
        alt={property.name}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if placeholder fails
          e.target.src = placeholderImage;
        }}
        sx={{
          objectFit: "cover", // Ensures image is scaled properly inside the fixed space
        }}
      />

      <CardContent sx={{ padding: "8px 16px", flexGrow: 1 }}>
        {/* Title with tooltip */}
        <Tooltip title={property.name} placement="top" arrow>
          <Typography
            variant="body2" // Smaller font size
            noWrap // Ensures that the text overflows with ellipsis if too long
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "1rem", // Custom smaller size for title
            }}
            gutterBottom
          >
            {property.name}
          </Typography>
        </Tooltip>

        {/* Address with tooltip */}
        <Tooltip
          title={`${property.address.street}, ${property.address.ward}, ${property.address.district}, ${property.address.province}`}
          placement="top"
          arrow
        >
          <Typography
            variant="body2" // Smaller font size
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.875rem", // Custom smaller size for address
            }}
          >
            {property.address.street}, {property.address.ward},{" "}
            {property.address.district}, {property.address.province}
          </Typography>
        </Tooltip>
      </CardContent>

      {/* Rate at the bottom-right of the card */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "absolute",
          bottom: 10,
          right: 10,
        }}
      >
        <Typography
          variant="body2"
          color="primary"
          sx={{ fontSize: "0.875rem" }}
        >
          ⭐ {property.rate}
        </Typography>
      </Box>
    </Card>
  );
};

// Define default props
PropertyCard.defaultProps = {
  property: {
    _id: "",
    name: "Unnamed Property",
    images: [],
    address: {
      street: "N/A",
      ward: "N/A",
      district: "N/A",
      province: "N/A",
    },
    rate: 0,
  },
};

// Define PropTypes for type checking
PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
      street: PropTypes.string.isRequired,
      ward: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      province: PropTypes.string.isRequired,
    }).isRequired,
    rate: PropTypes.number.isRequired,
  }),
};

export default PropertyCard;
