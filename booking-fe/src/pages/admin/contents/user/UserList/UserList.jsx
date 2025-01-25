import React, { useState, useEffect } from "react";
import UserTable from "../../../component/UserTable/UserTable";
import { getAllUser, deleteUserWithAdmin } from "../../../../../api/userAPI";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "react-router-dom"; // Import Link to add routing for Add New User

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const data = await getAllUser(token);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUserWithAdmin(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete the user. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="userManageListTitle"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="textSecondary">
          User Management
        </Typography>
        <Button
          component={Link}
          to="new"
          variant="outlined"
          color="success"
          size="small"
          sx={{ borderRadius: 1, fontSize: "14px" }}
        >
          Add New
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
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
            onClick={fetchUsers}
          >
            Retry
          </Button>
        </Box>
      ) : users.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No users found.
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <UserTable users={users} onDelete={handleDelete} />
        </Box>
      )}
    </Box>
  );
};

export default UserList;
