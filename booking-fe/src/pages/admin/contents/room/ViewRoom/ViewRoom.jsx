import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoomById } from "../../../../../api/roomAPI";
import { CircularProgress, Box, Alert } from "@mui/material";
import RoomDetail from "../../../component/RoomDetail/RoomDetail";

const ViewRoom = () => {
  const { id } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(id);
        setRoomData({
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
        });
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]); // Fetch data when ID changes

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !roomData) {
    return (
      <Box
        sx={{
          textAlign: "center",
          padding: 4,
        }}
      >
        <Alert severity="error">
          Failed to load room details. Please try again later.
        </Alert>
      </Box>
    );
  }

  return <RoomDetail roomData={roomData} />;
};

export default ViewRoom;
