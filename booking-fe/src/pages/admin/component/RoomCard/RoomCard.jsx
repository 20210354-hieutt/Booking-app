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

const RoomCard = ({ room }) => {
  const { name, property_id, price_per_night, images, size, type } = room;
  const propertyName = property_id?.name || "Unknown Property";

  return (
    <Card
      component={Link}
      to={`/admin/room/view/${room._id}`}
      sx={{
        width: 300, // Reduced width
        height: 180, // Reduced height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          boxShadow: 6,
        },
        position: "relative",
        borderRadius: 1, // Optional: rounding corners for a softer look
      }}
    >
      <CardMedia
        component="img"
        height="90" // Reduced image height
        image={images[0] || "https://via.placeholder.com/240x120"}
        alt={name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ padding: "4px 8px", flexGrow: 1 }}>
        <Tooltip title={name} placement="top" arrow>
          <Typography
            variant="body2"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.875rem", // Smaller text
            }}
            gutterBottom
          >
            {name}
          </Typography>
        </Tooltip>

        <Tooltip title={propertyName} placement="top" arrow>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.75rem",
              maxWidth: "60%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Property: {propertyName}
          </Typography>
        </Tooltip>

        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
          {" "}
          {/* Smaller text */}
          {type} - {size} m²
        </Typography>
      </CardContent>

      <Box
        sx={{
          position: "absolute",
          bottom: 8, // Adjusted position
          right: 8, // Adjusted position
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontSize: "0.75rem", // Smaller text
        }}
      >
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontSize: "0.75rem", fontWeight: "bold" }} // Smaller text
        >
          Price per Night
        </Typography>

        <Typography
          variant="body2"
          color="primary"
          sx={{ fontSize: "0.75rem" }} // Smaller text
        >
          Weekday:{" "}
          {price_per_night?.weekday
            ? `${price_per_night.weekday.toLocaleString()} VND`
            : "N/A"}
        </Typography>

        <Typography
          variant="body2"
          color="primary"
          sx={{ fontSize: "0.75rem" }} // Smaller text
        >
          Weekend:{" "}
          {price_per_night?.weekend
            ? `${price_per_night.weekend.toLocaleString()} VND`
            : "N/A"}
        </Typography>
      </Box>
    </Card>
  );
};

export default RoomCard;
