import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../../../api/userAPI";
import { CircularProgress, Box, Alert } from "@mui/material";
import UserDetail from "../../../component/UserDetail/UserDetail";
import { getBookingByOwner } from "../../../../../api/bookingAPI";
import { getPropertyByOwner } from "../../../../../api/propertyAPI";

const ViewUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await getUserById(id);
      console.log({ data });
      //const data = mockUserData;
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchBooking = async () => {
    try {
      const data = await getBookingByOwner(id);
      console.log({ data });
      setBookingData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchProperty = async () => {
    try {
      const page = 1;
      const limit = 20;
      const data = await getPropertyByOwner(id, page, limit);
      const propData = data.properties;
      console.log({ propData });
      setPropertyData(propData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchBooking();
    fetchProperty();
  }, [id]);

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

  if (error || !userData) {
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
    <UserDetail
      userData={userData}
      propertyData={propertyData}
      bookingData={bookingData}
    />
  );
};

export default ViewUser;
