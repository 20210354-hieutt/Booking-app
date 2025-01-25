import React, { useState } from "react";
import { Grid, Pagination } from "@mui/material";
import PropertyCard from "../PropertyCard/PropertyCard";

const PropertySection = ({ properties }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Number of cards per page

  // Calculate start and end index for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!properties.length) {
    return <p>No properties available.</p>;
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
        {currentProperties.map((property) => (
          <Grid
            item
            key={property._id}
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PropertyCard property={property} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(properties.length / itemsPerPage)} // Number of pages
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

export default PropertySection;
