import React, { useState } from "react";
import { Box, Grid, IconButton, Fade, Paper, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ImageGallery = ({ images, name }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const maxVisibleThumbnails = 3;

  const totalImages = images.length;

  const handlePrevThumbnails = () => {
    setSelectedImageIndex(selectedImageIndex - 1);
    if (visibleStartIndex > 0 && visibleStartIndex === selectedImageIndex) {
      setVisibleStartIndex(visibleStartIndex - 1);
    }
  };

  const handleNextThumbnails = () => {
    setSelectedImageIndex(selectedImageIndex + 1);
    if (
      visibleStartIndex + maxVisibleThumbnails === selectedImageIndex + 1 &&
      selectedImageIndex < totalImages
    ) {
      setVisibleStartIndex(visibleStartIndex + 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const canPrev = selectedImageIndex > 0;
  const canNext = selectedImageIndex + 1 < totalImages;

  const visibleThumbnails = images.slice(
    visibleStartIndex,
    visibleStartIndex + maxVisibleThumbnails,
  );

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Fade in={true} key={selectedImageIndex} timeout={500}>
          {images[selectedImageIndex] ? (
            <img
              src={images[selectedImageIndex]}
              alt={`${name} ${selectedImageIndex + 1}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.5s ease-in-out",
              }}
              loading="lazy"
            />
          ) : (
            <Paper
              variant="outlined"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                No Image Available
              </Typography>
            </Paper>
          )}
        </Fade>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={handlePrevThumbnails}
          aria-label="Previous Images"
          sx={{
            opacity: canPrev ? 1 : 0.3,
            pointerEvents: canPrev ? "auto" : "none",
            transition: "opacity 0.3s",
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </IconButton>
        <Box
          sx={{
            overflow: "hidden",
            width: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {visibleThumbnails.map((img, index) => {
              const actualIndex = visibleStartIndex + index;
              return (
                <Grid item xs={4} key={actualIndex}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      cursor: "pointer",
                      border:
                        actualIndex === selectedImageIndex
                          ? "2px solid #1976d2"
                          : "2px solid transparent",
                      borderRadius: 1,
                      overflow: "hidden",
                      transition: "border 0.3s, box-shadow 0.3s",
                      boxShadow:
                        actualIndex === selectedImageIndex
                          ? "0 0 10px rgba(25, 118, 210, 0.5)"
                          : "none",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => handleThumbnailClick(actualIndex)}
                  >
                    <img
                      src={img}
                      alt={`${name} Thumbnail ${actualIndex + 1}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                      loading="lazy"
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <IconButton
          onClick={handleNextThumbnails}
          aria-label="Next Images"
          sx={{
            opacity: canNext ? 1 : 0.3,
            pointerEvents: canNext ? "auto" : "none",
            transition: "opacity 0.3s",
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ImageGallery;
