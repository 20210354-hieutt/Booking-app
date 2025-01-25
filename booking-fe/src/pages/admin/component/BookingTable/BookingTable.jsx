import React, { useState, useEffect } from "react";
import "./BookingTable.css";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BookingTable = ({ bookings, onDelete }) => {
  const [data, setData] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  useEffect(() => {
    if (bookings && Array.isArray(bookings)) {
      const tableRows = bookings.map((booking) => ({
        ...booking,
        id: booking._id,
      }));
      setData(tableRows);
    } else {
      setData([]);
    }
  }, [bookings]);

  const columns = [
    {
      field: "userName",
      headerName: "User Name",
      width: 100,
      renderCell: (params) => (
        <div>{params.row.user_id?.userName || "N/A"}</div>
      ),
    },
    {
      field: "propertyName",
      headerName: "Property",
      width: 180,
      valueGetter: (params) => params.row.property?.name || "N/A",
    },
    {
      field: "rooms",
      headerName: "Rooms",
      width: 80,
      valueGetter: (params) => params.row.room_id?.length || 0,
    },
    {
      field: "checkIn",
      headerName: "Check-In Date",
      width: 140,
      valueGetter: (params) =>
        new Date(params.row.check_in_date).toLocaleDateString(),
    },
    {
      field: "checkOut",
      headerName: "Check-Out Date",
      width: 140,
      valueGetter: (params) =>
        new Date(params.row.check_out_date).toLocaleDateString(),
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      width: 110,
      valueGetter: (params) => `${params.row.total_price || 0}VNĐ`,
    },
    {
      field: "bookingStatus",
      headerName: "Booking Status",
      width: 130,
      renderCell: (params) => (
        <div className={`bookingCellWithRole ${params.row.booking_status}`}>
          {params.row.booking_status}
        </div>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => (
        <div className={`bookingCellWithRole ${params.row.payment_status}`}>
          {params.row.payment_status}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="bookingCellAction">
          <Link to={`edit/${params.row.id}`} style={{ textDecoration: "none" }}>
            <button className="bookingEditButton">Edit</button>
          </Link>
          <button
            className="bookingDeleteButton"
            onClick={() =>
              handleDeleteClick(params.row.id, params.row.user_id?.userName)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteClick = (id, userName) => {
    setSelectedId(id);
    setSelectedBookingDetails({ userName });
    setCurrentAction("Delete");
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (currentAction === "Delete" && selectedId) {
      onDelete(selectedId);
    }
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedBookingDetails(null);
    setCurrentAction(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedBookingDetails(null);
    setCurrentAction(null);
  };

  const CustomNoRowsOverlay = () => (
    <GridOverlay>
      <Typography variant="h6" color="text.secondary">
        No booking has been made by the user.
      </Typography>
    </GridOverlay>
  );
  return (
    <Box
      className={`bookingTableGridContainer ${dialogOpen ? "blurred" : ""}`}
      sx={{
        minHeight: "500px",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <DataGrid
        className="bookingTableGrid"
        rows={data}
        columns={columns}
        pageSize={7}
        rowsPerPageOptions={[7]}
        disableSelectionOnClick
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />

      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmAction}
        title={`Delete Booking`}
        content={`Are you sure you want to delete the booking of "${selectedBookingDetails?.userName}"?`}
      />
    </Box>
  );
};

export default BookingTable;
