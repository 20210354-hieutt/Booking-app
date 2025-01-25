import React, { useState, useEffect } from "react";
import PartnerRequestTable from "../../../component/PartnerRequestTable/PartnerRequestTable";
import {
  getPendingUser,
  acceptRequestPartner,
  declineRequestPartner,
} from "../../../../../api/userAPI";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const PartnerRequestList = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleAccept = async (id) => {
    try {
      await acceptRequestPartner(id);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      setSnackbar({
        open: true,
        message: "Partner request accepted successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error accepting partner request:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to accept the request. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineRequestPartner(id);
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
        display: "flex",
        flexDirection: "column",
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnerRequestList;
