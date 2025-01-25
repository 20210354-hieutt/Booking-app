import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoomTable from "../../../component/RoomsTable/RoomTable";
import RoomSection from "../../../component/RoomCardSection/RoomCardSection";
import {
  findRoomByProperty,
  findAvailableRoomWithSearch,
  getAllRoomWithDetails,
} from "../../../../../api/roomAPI";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const RoomManageList = () => {
  const [viewMode, setViewMode] = useState("cards");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllRoomWithDetails();
        setRooms(data);
        console.log({ data });
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewChange = (e) => {
    setViewMode(e.target.value);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getAllRoomWithDetails()
      .then((data) => setRooms(data))
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      className="roomManageList"
      sx={{
        height: "auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="roomManageListTitle"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="textSecondary">
          Room Management
        </Typography>
        {/* <Button
          component={Link}
          to="new"
          variant="outlined"
          color="success"
          size="small"
          sx={{ borderRadius: 1, fontSize: "14px" }}
        >
          Add New
        </Button> */}
      </Box>

      <Box
        className="viewBy"
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Typography variant="body1" sx={{ mr: 1 }}>
          View By:
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="viewModeSelectLabel">View Mode</InputLabel>
          <Select
            labelId="viewModeSelectLabel"
            id="viewModeSelect"
            value={viewMode}
            onChange={handleViewChange}
            label="View Mode"
            size="small"
          >
            <MenuItem value="cards">Cards</MenuItem>
            <MenuItem value="table">Table</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="roomContent" sx={{ flexGrow: 1, overflowY: "auto" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
            }}
          >
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Box>
        ) : rooms.length === 0 ? (
          <Typography variant="h6" align="center" mt={4}>
            No rooms found.
          </Typography>
        ) : viewMode === "cards" ? (
          <RoomSection rooms={rooms} />
        ) : (
          <RoomTable rooms={rooms} />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoomManageList;
