// src/pages/EditProperty.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  updatePropertyWithPartner,
} from "../../../../../api/propertyAPI";
import PropertyForm from "../../../component/PropertyForm/PropertyForm";
import { findRoomByProperty } from "../../../../../api/roomAPI";
import { getProvince } from "../../../../../api/addressAPI";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch the property data
        const rooms = await findRoomByProperty(id);
        const propertyData = await getPropertyById(id);

        if (propertyData) {
          propertyData.rooms = rooms;
        }

        // Fetch all address data
        const addressList = await getProvince();

        // Extract property address from fetched data
        const address = propertyData.address || {};

        let provinceCode = "";
        let districtCode = "";
        let wardCode = "";

        // Match the address names to their codes
        if (address.province) {
          const selectedProvince = addressList.find(
            (p) => p.name === address.province
          );
          if (selectedProvince) {
            provinceCode = selectedProvince.code;

            const selectedDistrict = selectedProvince.districts.find(
              (d) => d.name === address.district
            );
            if (selectedDistrict) {
              districtCode = selectedDistrict.code;

              const selectedWard = selectedDistrict.wards.find(
                (w) => w.name === address.ward
              );
              if (selectedWard) {
                wardCode = selectedWard.code;
              }
            }
          }
        }

        setInitialData({
          ...propertyData,
          address: {
            ...propertyData.address,
            province: address.province || "",
            district: address.district || "",
            ward: address.ward || "",
            provinceCode: provinceCode,
            districtCode: districtCode,
            wardCode: wardCode,
          },
        });
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleUpdateSubmit = async (formData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log({ formData });
      const response = await updatePropertyWithPartner(formData, accessToken);
      console.log(response);

      // If successful, show success snackbar
      setSnackbar({
        open: true,
        message: "Property updated successfully!",
        severity: "success",
      });

      // After showing the snackbar, navigate to the details page
      setTimeout(() => {
        navigate(`/admin/property/view/${id}`);
      }, 2000); // Adjust delay as needed
    } catch (error) {
      console.error("Failed to update property:", error);
      setSnackbar({
        open: true,
        message: "Failed to update the property. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !initialData) {
    return (
      <Box
        sx={{
          textAlign: "center",
          padding: 4,
        }}
      >
        <Alert severity="error">
          Failed to load property details. Please try again later.
        </Alert>
      </Box>
    );
  }

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
          to={`/admin/property/view/${id}`}
        >
          Back to Details
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <PropertyForm
            initialData={initialData}
            onSubmit={handleUpdateSubmit}
            formTitle="Edit Property"
          />
        </Grid>
      </Grid>

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

export default EditProperty;
