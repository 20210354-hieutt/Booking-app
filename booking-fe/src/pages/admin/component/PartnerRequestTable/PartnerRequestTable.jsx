import React, { useState, useEffect } from "react";
import "./PartnerRequestTable.css";
import { DataGrid } from "@mui/x-data-grid";

const PartnerRequestTable = ({ partnerRequests, onAccept, onDecline }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const tableRows = partnerRequests.map((partnerRequest) => ({
      ...partnerRequest,
      id: partnerRequest._id,
    }));
    setData(tableRows);
  }, [partnerRequests]);

  const columns = [
    {
      field: "userName",
      headerName: "User Name",
      width: 200,
      renderCell: (params) => <div>{params.row.userName}</div>,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },
    {
      field: "address",
      headerName: "Address",
      width: 300,
      valueGetter: (params) => {
        const { province, district, ward } = params.row.address || {};
        return `${province || ""}, ${district || ""}, ${ward || ""}`;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="cellAction">
          <div className="acceptButton" onClick={() => onAccept(params.row.id)}>
            Accept
          </div>
          <div
            className="declineButton"
            onClick={() => onDecline(params.row.id)}
          >
            Decline
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="partnerRequestGrid">
      <DataGrid
        className="partnerRequestGrid"
        rows={data}
        columns={columns}
        pageSize={9}
        disableSelectionOnClick
      />
    </div>
  );
};

export default PartnerRequestTable;
