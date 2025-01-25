import React from "react";
import { Box, Grid, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import UserForm from "../../../component/UserForm/UserForm";

import { createUserWithAdmin, signUp } from "../../../../../api/userAPI";

const AddNewUser = () => {
  const navigate = useNavigate();

  const handleCreateSubmit = async (data) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log({ data });
      const response = await createUserWithAdmin(data);
      //const response = await signUp(data);
      console.log(response);
      navigate(`/admin/user`);
    } catch (error) {
      console.error("Failed to add user:", error);
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
          to="/admin/user" // Link to your user list
        >
          Back to User List
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <UserForm
            initialData={{
              _id: "",
              userName: "",
              email: "",
              role: "",
              password: "",
              confirmPassword: "",
              address: {
                province: "",
                district: "",
                ward: "",
                provinceCode: "",
                districtCode: "",
                wardCode: "",
              },
            }}
            onSubmit={handleCreateSubmit}
            formTitle="Create New User"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddNewUser;
