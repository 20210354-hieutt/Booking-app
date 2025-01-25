// ViewPartnerRequest.jsx
import React, { useState, useEffect } from "react";
import PartnerRequestTable from "../../../component/PartnerRequestTable/PartnerRequestTable";
import { getPendingUser } from "../../../../../api/userAPI";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const ViewPartnerRequest = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingUser();
      setPendingUsers(data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load partner requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAccept = async (id) => {
    try {
      //await acceptPartnerRequest(id);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      alert("Partner request accepted successfully.");
    } catch (err) {
      console.error("Error accepting partner request:", err);
      alert("Failed to accept the request. Please try again.");
    }
  };

  const handleDecline = async (id) => {
    try {
      //await declinePartnerRequest(id);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      alert("Partner request declined successfully.");
    } catch (err) {
      console.error("Error declining partner request:", err);
      alert("Failed to decline the request. Please try again.");
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
      }}
    >
      <Typography variant="h4" gutterBottom>
        Partner Requests
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
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
            onClick={fetchPendingUsers}
          >
            Retry
          </Button>
        </Box>
      ) : pendingUsers.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No pending partner requests.
        </Typography>
      ) : (
        <PartnerRequestTable
          partnerRequests={pendingUsers}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </Box>
  );
};

export default ViewPartnerRequest;
