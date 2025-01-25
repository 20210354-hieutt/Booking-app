import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUserWithAdmin } from "../../../../../api/userAPI";
import { getProvince } from "../../../../../api/addressAPI"; // Import getProvince
import UserForm from "../../../component/UserForm/UserForm";
import UpdateUserForm from "../../../component/UserForm/UpdateUserForm";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedData = await getUserById(id);

        // Fetch all address data to match the names back to codes
        const addressList = await getProvince();

        let provinceCode = "";
        let districtCode = "";
        let wardCode = "";

        if (fetchedData.address) {
          // Find the province by name
          const selectedProvince = addressList.find(
            (p) => p.name === fetchedData.address.province
          );

          if (selectedProvince) {
            provinceCode = selectedProvince.code;

            // Find the district by name
            const selectedDistrict = selectedProvince.districts.find(
              (d) => d.name === fetchedData.address.district
            );

            if (selectedDistrict) {
              districtCode = selectedDistrict.code;

              // Find the ward by name
              const selectedWard = selectedDistrict.wards.find(
                (w) => w.name === fetchedData.address.ward
              );

              if (selectedWard) {
                wardCode = selectedWard.code;
              }
            }
          }
        }

        // Convert role array to a single string if needed
        let roleValue = "";
        if (Array.isArray(fetchedData.role) && fetchedData.role.length > 0) {
          roleValue = fetchedData.role[0];
        } else {
          roleValue = fetchedData.role || "";
        }

        // Convert the dob to YYYY-MM-DD format
        const dobValue = fetchedData.dob ? fetchedData.dob.split("T")[0] : "";

        setInitialData({
          ...fetchedData,
          role: roleValue,
          dob: dobValue,
          address: {
            province: fetchedData.address?.province || "",
            district: fetchedData.address?.district || "",
            ward: fetchedData.address?.ward || "",
            provinceCode: provinceCode,
            districtCode: districtCode,
            wardCode: wardCode,
          },
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdateSubmit = async (data) => {
    try {
      const response = await updateUserWithAdmin(id, data);
      navigate(`/admin/user/view/${id}`);
    } catch (error) {
      console.error("Failed to update user:", error);
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
          Failed to load user details. Please try again later.
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
          to={`/admin/user/view/${id}`}
        >
          Back to Details
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <UpdateUserForm
            initialData={initialData}
            onSubmit={handleUpdateSubmit}
            formTitle="Edit User"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditUser;
