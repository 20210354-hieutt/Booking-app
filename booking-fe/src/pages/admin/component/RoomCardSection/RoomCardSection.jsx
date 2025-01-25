import React, { useState } from "react";
import { Grid, Pagination } from "@mui/material";
import RoomCard from "../RoomCard/RoomCard";

const RoomSection = ({ rooms }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = rooms.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    // Guard against invalid page numbers
    setPage(Math.max(value, 1));
  };

  if (!rooms.length) {
    return <p>No rooms available.</p>;
  }

  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{
          padding: 2,
          maxWidth: "100%",
        }}
      >
        {currentRooms.map((room) => (
          <Grid
            item
            key={room._id}
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(rooms.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      />
    </div>
  );
};

export default RoomSection;
