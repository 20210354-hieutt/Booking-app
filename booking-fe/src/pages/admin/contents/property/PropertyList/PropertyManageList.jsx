import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyTable from "../../../component/PropertyTable/PropertyTable";
import PropertySection from "../../../component/PropertyCardSection/PropertyCardSection";
import {
  getAllProperty,
  deletePropertyById,
} from "../../../../../api/propertyAPI";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const PropertyManageList = () => {
  const [viewMode, setViewMode] = useState("cards");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProperty();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewChange = (e) => {
    setViewMode(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      await deletePropertyById(id, userId, 1, 10);
      setProperties((prev) => prev.filter((property) => property._id !== id));
      setSnackbar({
        open: true,
        message: "Property deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete the property. Please try again.",
        severity: "error",
      });
    }
  };
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getAllProperty()
      .then((data) => setProperties(data))
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      className="propertyManageList"
      sx={{
        height: "auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="propertyManageListTitle"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="textSecondary">
          Property Management
        </Typography>
        <Button
          component={Link}
          to="/admin/property/new"
          variant="outlined"
          color="success"
          size="small"
          sx={{ borderRadius: 1, fontSize: "14px" }}
        >
          Add New
        </Button>
      </Box>

      <Box
        className="viewBy"
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <Typography variant="body1" sx={{ mr: 1 }}>
          View By:
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="viewModeSelectLabel">View Mode</InputLabel>
          <Select
            labelId="viewModeSelectLabel"
            id="viewModeSelect"
            value={viewMode}
            onChange={handleViewChange}
            label="View Mode"
            size="small"
          >
            <MenuItem value="cards">Cards</MenuItem>
            <MenuItem value="table">Table</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="propertyContent" sx={{ flexGrow: 1, overflowY: "auto" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
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
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Box>
        ) : properties.length === 0 ? (
          <Typography variant="h6" align="center" mt={4}>
            No properties found.
          </Typography>
        ) : viewMode === "cards" ? (
          <PropertySection properties={properties} />
        ) : (
          <PropertyTable properties={properties} onDelete={handleDelete} />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyManageList;
