import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import AddModal from "./AddModal";

const AddSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
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
        sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        <Typography variant="h5" fontWeight={550}>
          {t("addSection.studentsData")}
        </Typography>

        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={toggleModalHandler}
          sx={{
            display: "flex",
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ display: { xs: "none", sm: "flex" }, textTransform: "none" }}
          >
            {t("addSection.addStudent")}
          </Typography>
        </Button>
      </Box>

      <AddModal type="CREATE" isOpen={isOpen} onClose={toggleModalHandler} />
    </Box>
  );
};

export default AddSection;
