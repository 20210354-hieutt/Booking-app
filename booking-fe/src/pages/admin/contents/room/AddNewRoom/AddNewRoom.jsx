// src/pages/CreateNewRoom.jsx

import React from "react";
import { Box, Grid, Button, Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import RoomForm from "../../../component/RoomForm/RoomForm";

const AddNewRoom = () => {
  const navigate = useNavigate();

  const handleCreateSubmit = async (formData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log("Submitting Room Data:", formData);
      //const response = await createRoom(formData, accessToken);
      //console.log("Room Created:", response);

      navigate("/admin/room");
    } catch (error) {
      console.error("Failed to add room:", error);

      throw error; // Re-throw to let RoomForm handle any additional logic if needed
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          component={Link}
          to="/admin/room"
        >
          Back to Rooms List
        </Button>
      </Box>

      {/* Room Form */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <RoomForm
            initialData={{
              name: "",
              type: "",
              size: "",
              capacity: { adults: "", childs: { count: "", age: "" } },
              price_per_night: { weekday: "", weekend: "" },
              images: [],
              imageFiles: [],
            }}
            onSubmit={handleCreateSubmit}
            formTitle="Create New Room"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddNewRoom;
