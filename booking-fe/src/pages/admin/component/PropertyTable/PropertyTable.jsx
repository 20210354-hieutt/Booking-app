// src/components/PropertyTable/PropertyTable.jsx

import React, { useState, useEffect } from "react";
import "./PropertyTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const PropertyTable = ({ properties, onDelete }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const tableRows = properties.map((property) => ({
    ...property,
    id: property._id,
  }));

  const propertyColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "owner_id",
      headerName: "Owner",
      width: 200,
      renderCell: (params) => getOwnerName(params.row.owner_id),
    },
    {
      field: "address",
      headerName: "Address",
      width: 280,
      valueGetter: (params) =>
        `${params.row.address?.province || ""}, ${params.row.address?.district || ""}, ${params.row.address?.ward || ""}, ${params.row.address?.street || ""}`,
    },
    {
      field: "property_type",
      headerName: "Type",
      width: 130,
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 80,
      renderCell: (params) => (
        <div className="propertyRateCell">{params.row.rate || "N/A"}</div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="propertyCellAction">
          <Link
            to={`/admin/property/view/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <button className="propertyViewButton">View</button>
          </Link>
          <button
            className="propertyDeleteButton"
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  function getOwnerName(ownerId) {
    return "Owner";
  }

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProperty) {
      onDelete(selectedProperty._id);
    }
    setDialogOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div
      className={`propertyTableGridContainer ${dialogOpen ? "blurred" : ""}`}
    >
      <DataGrid
        className="propertyTableGrid"
        rows={tableRows}
        columns={propertyColumns}
        pageSize={7}
        rowsPerPageOptions={[7]}
        disableSelectionOnClick
      />

      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        title="Delete Property"
        content={`Are you sure you want to delete the property "${selectedProperty?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PropertyTable;
