// src/pages/EditBooking.jsx

import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getBookingById,
  updateBookingWithAdmin,
} from "../../../../../api/bookingAPI";
import BookingForm from "../../../component/BookingForm/BookingForm";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const fetchedData = await getBookingById(id);

        console.log({ fetchedData });
        const checkInDate = fetchedData.check_in_date
          ? fetchedData.check_in_date.split("T")[0]
          : "";
        const checkOutDate = fetchedData.check_out_date
          ? fetchedData.check_out_date.split("T")[0]
          : "";

        const capacity = fetchedData.capacity || {};
        const adults = capacity.adults || 0;
        const childs = capacity.childs?.count || 0;
        const childAge = capacity.childs?.age || "";

        setInitialData({
          ...fetchedData,
          _id: fetchedData._id || "",
          booking_status: fetchedData.booking_status || "",
          payment_status: fetchedData.payment_status || "",
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: fetchedData.total_price || 0,
          request: fetchedData.request || "",
          // capacity fields
          adults,
          childs,
          childAge,
          property: fetchedData.property || "",
          room_id: fetchedData.room_id || [],
          user_id: fetchedData.user_id || "",
        });
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleUpdateSubmit = async (formData) => {
    try {
      const payload = {
        booking_status: formData.booking_status,
        payment_status: formData.payment_status,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        total_price: parseFloat(formData.total_price),
        capacity: {
          adults: parseInt(formData.adults, 10),
          childs: {
            count: parseInt(formData.childs, 10),
            age: formData.childAge,
          },
        },
      };

      await updateBookingWithAdmin(id, payload);
      navigate(`/admin/booking`);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

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

  if (error || !initialData) {
    return (
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Alert severity="error">
          Failed to load booking details. Please try again later.
        </Alert>
      </Box>
    );
  }

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
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          component={Link}
          to={`/admin/booking`}
        >
          Back to Booking Management
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <BookingForm
            initialData={initialData}
            onSubmit={handleUpdateSubmit}
            formTitle="Edit Booking"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditBooking;
