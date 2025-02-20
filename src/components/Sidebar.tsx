import { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import SignoutModal from "./SignoutModal";
import schoolImage from "../assets/school.svg";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 200,
        height: "100%",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "20px",
      }}
    >
      <Box flex={1}>
        <Box
          display="flex"
          alignItems="center"
          borderLeft="4px solid #1F7BF4"
          paddingLeft="16px"
          gap={1}
          className="bg-slate-100"
        >
          <Avatar
            src={schoolImage}
            variant="square"
            sx={{ height: 24, width: 24 }}
          />
          <Typography
            noWrap
            variant="h6"
            sx={{
              color: "black",
              textDecoration: "none",
            }}
          >
            Student's Data
          </Typography>
        </Box>
      </Box>

      <Box
        mb={7}
        gap={1}
        display="flex"
        alignItems="center"
        justifyContent="left"
        sx={{ cursor: "pointer" }}
        onClick={() => setIsOpen(true)}
        paddingLeft="16px"
      >
        <PowerSettingsNewIcon color="action" sx={{ display: "flex" }} />

        <Typography
          noWrap
          sx={{
            color: "black",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Logout
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Box display={{ xs: "block", md: "none" }}>{DrawerList}</Box>

      <Box
        sx={{
          height: "100%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {DrawerList}
      </Box>

      <SignoutModal onClose={closeModalHandler} isOpen={isOpen} />
    </>
  );
};

export default Sidebar;
