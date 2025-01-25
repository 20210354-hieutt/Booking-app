import "./RoomTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const RoomTable = ({ rooms, onDelete }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const tableRows = rooms.map((room) => ({
    ...room,
    id: room._id,
  }));

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) {
      onDelete(selectedRoom._id);
    }
    setDialogOpen(false);
    setSelectedRoom(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRoom(null);
  };

  const getPricePerNight = (price) => {
    if (!price) return "N/A";
    return `Weekday: ${price.weekday.toLocaleString()} VND / Weekend: ${price.weekend.toLocaleString()} VND`;
  };

  const roomColumn = [
    {
      field: "name",
      headerName: "Room Name",
      width: 200,
    },
    {
      field: "property_id",
      headerName: "Property Name",
      width: 200,
      renderCell: (params) =>
        params.row.property_id?.name || "Unknown Property",
    },
    {
      field: "type",
      headerName: "Room Type",
      width: 100,
      renderCell: (params) => params.row.type || "N/A",
    },
    {
      field: "capacity",
      headerName: "Capacity",
      width: 150,
      renderCell: (params) =>
        `${params.row.capacity?.adults || 0} Adults / ${params.row.capacity?.childs?.count || 0} Childs`,
    },
    {
      field: "price_per_night",
      headerName: "Price per Night (Weekday/Weekend)",
      width: 350,
      renderCell: (params) => getPricePerNight(params.row.price_per_night),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="roomCellAction">
          <Link to={`view/${params.row.id}`} style={{ textDecoration: "none" }}>
            <button className="roomViewButton">View</button>
          </Link>
          <button
            className="roomDeleteButton"
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`roomTableGridContainer ${dialogOpen ? "blurred" : ""}`}>
      <DataGrid
        className="roomTableGrid"
        rows={tableRows}
        columns={roomColumn}
        pageSize={7}
        rowsPerPageOptions={[7]}
        disableSelectionOnClick
      />

      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        title="Delete Room"
        content={`Are you sure you want to delete the room "${selectedRoom?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default RoomTable;
