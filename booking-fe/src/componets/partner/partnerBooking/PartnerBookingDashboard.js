import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Input,
} from "@mui/material";

import axios from "axios";
import { getBooking } from "../../../api/bookingAPI";
import Loading from "../../loading/Loading";
import "./PartnerBookingDashboard.css";
import { formatCurrency } from "../../../helpers/currencyHelpers";
import { useNavigate } from "react-router-dom";
const PartnerBookingDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("Name");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const handleGetBooking = async () => {
    try {
      const response = await getBooking(userId);
      console.log(response)
      setBookings(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  useEffect(() => {
    handleGetBooking();
  }, []);

  const onChangeValue = (value) => {
    if (value) {
      const bookingSearch = bookings.filter((booking) =>
        booking.propertyDetails.name.includes(value),
      );

      setBookings(bookingSearch);
    } else {
      handleGetBooking();
    }
  };
  const onChangeStatus = (value) => {
    if (value === "All") {
      setFilterStatus(value);

      handleGetBooking();
    } else {
      setFilterStatus(value);
      const bookingSearch = bookings.filter((booking) =>
        booking.booking_status.includes(value),
      );

      setBookings(bookingSearch);
    }
  };

  return (
    <div className="partner-booking-dashboard">
      <FormControl
        style={{
          marginBottom: 20,
          width: "100%",
          textAlign: "end",
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            marginRight: "5%",
            width: "8%",
            textAlign: "start",
          }}
        >
          <MenuItem value="Name">Name</MenuItem>
          <MenuItem value="Property's Name">Property's Name</MenuItem>
          <MenuItem value="Room's Name">Room's Name</MenuItem>
          <MenuItem value="Status">Status</MenuItem>
        </Select>
        {filter === "Status" ? (
          <Select
            value={filterStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            style={{
              width: "20%",
              textAlign: "start",
            }}
          >
            <MenuItem value="All">All</MenuItem>

            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Canceled">Canceled</MenuItem>
          </Select>
        ) : (
          <Input
            style={{
              width: "20%",
            }}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        )}
      </FormControl>

      {/* Booking Table */}
      {bookings ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Property Name</TableCell>
                <TableCell>Rooms</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Check-In</TableCell>
                <TableCell>Check-Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow
                  key={booking._id}
                  className="hover-row"
                  onClick={() =>
                    navigate(`/partnerBookingDetail/${booking._id}`, {
                      state: bookings[index],
                    })
                  }
                >
                  <TableCell>
                    {booking.userDetails[0]?.email ||
                      booking.userDetails[0]?.userName}
                  </TableCell>
                  <TableCell>
                    {booking.propertyDetails?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {booking.roomDetails
                      .map((room) => room.name || "Unnamed Room")
                      .join(", ")}
                  </TableCell>
                  <TableCell
                    style={{
                      paddingLeft: "2%",
                    }}
                  >
                    {/* Calculate total guests */}
                    {booking.capacity.adults +
                      (booking.capacity.childs?.count || 0)}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.check_in_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.check_out_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.booking_status}</TableCell>
                  <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default PartnerBookingDashboard;
