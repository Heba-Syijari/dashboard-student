import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddModal from "./AddModal";

const AddSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModalHandler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Box boxSizing="border-box">
      <Box
        mb={3}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight={550}>
          Students' Data
        </Typography>

        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={toggleModalHandler}
        >
          <Typography
            sx={{ display: { xs: "none", sm: "flex" }, textTransform: "none" }}
          >
            {" "}
            Add Student
          </Typography>
        </Button>
      </Box>

      <AddModal type="CREATE" isOpen={isOpen} onClose={toggleModalHandler} />
    </Box>
  );
};

export default AddSection;
