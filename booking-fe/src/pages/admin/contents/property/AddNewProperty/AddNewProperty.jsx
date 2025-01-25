import React, { useState } from "react";
import { Box, Grid, Button, Snackbar, Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import PropertyForm from "../../../component/PropertyForm/PropertyForm";
import { createPropertyWithPartner } from "../../../../../api/propertyAPI";

const AddNewProperty = () => {
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    // Navigate back to property list after closing the snackbar
    navigate("/admin/property");
  };

  const handleCreateSubmit = async (formData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log({ formData });
      const response = await createPropertyWithPartner(formData, accessToken);
      console.log(response);

      setSnackbar({
        open: true,
        message: "Property created successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to add property:", error);
      setSnackbar({
        open: true,
        message: "Failed to create property. Please try again.",
        severity: "error",
      });
    }
  };

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
          to="/admin/property"
        >
          Back to Property List
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <PropertyForm
            initialData={{
              name: "",
              property_type: "",
              address: {
                street: "",
                ward: "",
                district: "",
                province: "",
              },
              owner_id: "",
              description: "",
              images: [],
            }}
            onSubmit={handleCreateSubmit}
            formTitle="Create New Property"
          />
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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

export default AddNewProperty;
