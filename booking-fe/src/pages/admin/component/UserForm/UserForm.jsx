import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { getProvince } from "../../../../api/addressAPI";

const UserForm = ({ initialData, onSubmit, formTitle }) => {
  const [userData, setUserData] = useState({
    userName: initialData.userName || "",
    email: initialData.email || "",
    role: initialData.role || "",
    password: "",
    confirmPassword: "",
    dob: initialData.dob || "", // Date of Birth field
    phoneNumber: initialData.phoneNumber || "", // Phone Number field
    address: {
      province: initialData.address?.province || "",
      district: initialData.address?.district || "",
      ward: initialData.address?.ward || "",
      provinceCode: initialData.address?.provinceCode || "",
      districtCode: initialData.address?.districtCode || "",
      wardCode: initialData.address?.wardCode || "",
    },
  });

  const [addressData, setAddressData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingAddressData, setLoadingAddressData] = useState(false);
  useEffect(() => {
    if (initialData._id) {
      setUserData((prevData) => ({
        ...prevData,
        _id: initialData._id,
      }));
    }
  }, []);

  useEffect(() => {
    fetchAddressData();
  }, []);

  useEffect(() => {
    console.log("User Data Updated:", userData);
  }, [userData]);
  // Fetch address data from API
  const fetchAddressData = async () => {
    setLoadingAddressData(true);
    try {
      const response = await getProvince();
      setAddressData(response);
      // If updating, set districts and wards based on initialData
      if (initialData.address?.provinceCode) {
        const selectedProvince = response.find(
          (p) => p.code === initialData.address.provinceCode
        );
        setDistricts(selectedProvince?.districts || []);
        if (initialData.address.districtCode) {
          const selectedDistrict = selectedProvince?.districts.find(
            (d) => d.code === initialData.address.districtCode
          );
          setWards(selectedDistrict?.wards || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    } finally {
      setLoadingAddressData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const code = value ? parseInt(value) : "";

    if (name === "province") {
      const selectedProvince = addressData.find((p) => p.code === code);
      setDistricts(selectedProvince?.districts || []);
      setWards([]);
      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          province: selectedProvince ? selectedProvince.name : "",
          provinceCode: code || "",
          district: "",
          districtCode: "",
          ward: "",
          wardCode: "",
        },
      }));
    } else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.code === code);
      setWards(selectedDistrict?.wards || []);
      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          district: selectedDistrict ? selectedDistrict.name : "",
          districtCode: code || "",
          ward: "",
          wardCode: "",
        },
      }));
    } else if (name === "ward") {
      const selectedWard = wards.find((w) => w.code === code);
      setUserData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          ward: selectedWard ? selectedWard.name : "",
          wardCode: code || "",
        },
      }));
    }
  };

  const validateForm = () => {
    if (!userData.userName.trim()) return "Username is required.";
    if (!userData.email.trim()) return "Email is required.";
    if (!userData.role.trim()) return "Role is required.";
    if (!userData.dob.trim()) return "Date of Birth is required.";
    if (!userData.phoneNumber.trim()) return "Phone number is required.";
    if (userData.password && userData.password !== userData.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const {
        userName,
        email,
        role,
        password,
        confirmPassword,
        dob,
        phoneNumber,
        address,
      } = userData;
      await onSubmit(userData);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting user form:", err);
      setSubmitError(
        err.message || "Failed to submit user data. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 3,
        mb: 4,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {formTitle || "User Form"}
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          User submitted successfully!
        </Alert>
      )}

      {/* Username */}
      <TextField
        label="UserName"
        variant="outlined"
        fullWidth
        margin="normal"
        name="userName"
        value={userData.userName}
        onChange={handleInputChange}
        required
      />

      {/* Email */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        name="email"
        value={userData.email}
        onChange={handleInputChange}
        required
      />

      {/* Role */}
      <TextField
        select
        label="Role"
        variant="outlined"
        fullWidth
        margin="normal"
        name="role"
        value={userData.role}
        onChange={handleInputChange}
        required
      >
        {["Member", "Partner"].map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      {/* Password */}
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        name="password"
        type="password"
        value={userData.password}
        onChange={handleInputChange}
        required={userData._id === ""}
      />

      {/* Confirm Password */}
      <TextField
        label="Confirm Password"
        variant="outlined"
        fullWidth
        margin="normal"
        name="confirmPassword"
        type="password"
        value={userData.confirmPassword}
        onChange={handleInputChange}
        required={userData._id === ""}
      />

      {/* Date of Birth */}
      <TextField
        label="Date of Birth"
        variant="outlined"
        fullWidth
        margin="normal"
        name="dob"
        type="date"
        value={userData.dob}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />

      {/* Phone Number */}
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        name="phoneNumber"
        value={userData.phoneNumber}
        onChange={handleInputChange}
        required
      />

      {/* Address - Province */}
      <TextField
        select
        label="Province"
        variant="outlined"
        fullWidth
        margin="normal"
        name="province"
        value={userData.address.provinceCode}
        onChange={handleAddressChange}
        required
        disabled={loadingAddressData}
      >
        {addressData.map((province) => (
          <MenuItem key={province.code} value={province.code}>
            {province.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Address - District */}
      <TextField
        select
        label="District"
        variant="outlined"
        fullWidth
        margin="normal"
        name="district"
        value={userData.address.districtCode}
        onChange={handleAddressChange}
        disabled={!userData.address.provinceCode || loadingAddressData}
        required
      >
        {districts.map((district) => (
          <MenuItem key={district.code} value={district.code}>
            {district.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Address - Ward */}
      <TextField
        select
        label="Ward"
        variant="outlined"
        fullWidth
        margin="normal"
        name="ward"
        value={userData.address.wardCode}
        onChange={handleAddressChange}
        disabled={!userData.address.districtCode || loadingAddressData}
        required
      >
        {wards.map((ward) => (
          <MenuItem key={ward.code} value={ward.code}>
            {ward.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : userData._id
            ? "Update User"
            : "Create User"}
      </Button>
    </Box>
  );
};

UserForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    userName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    dob: PropTypes.string, // Added Date of Birth to PropTypes
    phoneNumber: PropTypes.string, // Added Phone Number to PropTypes
    address: PropTypes.shape({
      province: PropTypes.string,
      district: PropTypes.string,
      ward: PropTypes.string,
      provinceCode: PropTypes.string,
      districtCode: PropTypes.string,
      wardCode: PropTypes.string,
    }),
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  formTitle: PropTypes.string,
};

UserForm.defaultProps = {
  initialData: {
    _id: "",
    userName: "",
    email: "",
    role: "",
    dob: "", // Default Date of Birth as empty string
    phoneNumber: "", // Default Phone Number as empty string
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
  },
  formTitle: "User Form",
};

export default UserForm;
