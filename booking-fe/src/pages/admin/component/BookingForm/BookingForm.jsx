import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";

const BookingForm = ({ initialData, onSubmit, formTitle }) => {
  const [formData, setFormData] = useState({
    _id: initialData._id || "",
    booking_status: initialData.booking_status || "",
    payment_status: initialData.payment_status || "",
    check_in_date: initialData.check_in_date || "",
    check_out_date: initialData.check_out_date || "",
    total_price: initialData.total_price || "",
    request: initialData.request || "",
    adults: initialData.adults || "",
    childs: initialData.childs || "",
    childAge: initialData.childAge || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.booking_status.trim()) return "Booking status is required.";
    if (!formData.payment_status.trim()) return "Payment status is required.";
    if (!formData.check_in_date.trim()) return "Check-in date is required.";
    if (!formData.check_out_date.trim()) return "Check-out date is required.";
    if (!formData.total_price) return "Total price is required.";
    if (isNaN(formData.total_price)) return "Total price must be a number.";
    return null;
  };
  useEffect(() => {
    console.log("Init Data:", { initialData });
  }, []);
  useEffect(() => {
    console.log("Booking Data Updated:", formData);
  }, [formData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting booking form:", err);
      setErrorMessage(
        err.message || "Failed to submit booking data. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 3,
        mb: 4,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {formTitle || "Booking Form"}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Booking updated successfully!
        </Alert>
      )}

      {/* Booking Status */}
      <TextField
        select
        label="Booking Status"
        variant="outlined"
        fullWidth
        margin="normal"
        name="booking_status"
        value={formData.booking_status}
        onChange={handleInputChange}
        required
      >
        {["Pending", "Confirmed", "Cancelled", "Completed"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      {/* Payment Status */}
      <TextField
        select
        label="Payment Status"
        variant="outlined"
        fullWidth
        margin="normal"
        name="payment_status"
        value={formData.payment_status}
        onChange={handleInputChange}
        required
      >
        {["Paid", "Unpaid", "Refunded"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      {/* Check-in Date */}
      <TextField
        label="Check-in Date"
        variant="outlined"
        fullWidth
        margin="normal"
        name="check_in_date"
        type="date"
        value={formData.check_in_date}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />

      {/* Check-out Date */}
      <TextField
        label="Check-out Date"
        variant="outlined"
        fullWidth
        margin="normal"
        name="check_out_date"
        type="date"
        value={formData.check_out_date}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />

      {/* Total Price */}
      <TextField
        label="Total Price"
        variant="outlined"
        fullWidth
        margin="normal"
        name="total_price"
        type="number"
        value={formData.total_price}
        onChange={handleInputChange}
        required
      />

      {/* Adults */}
      <TextField
        label="Adults"
        variant="outlined"
        fullWidth
        margin="normal"
        name="adults"
        type="number"
        value={formData.adults}
        onChange={handleInputChange}
      />

      {/* Children Count */}
      <TextField
        label="Children Count"
        variant="outlined"
        fullWidth
        margin="normal"
        name="childs"
        type="number"
        value={formData.childs}
        onChange={handleInputChange}
      />

      {/* Children Age */}
      <TextField
        label="Children Age"
        variant="outlined"
        fullWidth
        margin="normal"
        name="childAge"
        type="number"
        value={formData.childAge}
        onChange={handleInputChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Update Booking"}
      </Button>
    </Box>
  );
};

export default BookingForm;
