import React, { useState, useEffect } from "react";
import BookingTable from "../../../component/BookingTable/BookingTable";
import {
  deleteBookingByAdmin,
  getAllBooking,
} from "../../../../../api/bookingAPI";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const data = await getAllBooking(token);
      console.log({ data });

      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBookingByAdmin(id);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete the booking. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
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
            onClick={fetchBookings}
          >
            Retry
          </Button>
        </Box>
      ) : bookings.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No bookings found.
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <BookingTable bookings={bookings} onDelete={handleDelete} />
        </Box>
      )}
    </Box>
  );
};

export default BookingList;
