import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  Drawer,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";

import Sidebar from "./Sidebar";
import avatarImage from "../assets/user.jpeg";
import bookImage from "../assets/open-book.svg";
import { useLanguage } from "../hooks/useSession";
// import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import { UserData } from "../types";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { language, onChangeLanguage } = useLanguage();
  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };
  const handleLanguageChange = (value: 0 | 1) => {
    onChangeLanguage(value);
    i18n.changeLanguage(value === 0 ? "en" : "ar");
  };
  const user = queryClient.getQueryData<UserData>(["user"]);
  console.log("user", user);
  // const { data: user } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: () => queryClient.getQueryData(["user"]),
  // });
  queryClient.getMutationCache();
  return (
    <>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          backgroundColor: "white",
          border: "2px solid #E8E8E8",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <Toolbar disableGutters>
          <Box maxWidth={200} display="flex" alignItems="center" mx="24px">
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Avatar
              src={bookImage}
              variant="square"
              sx={{
                height: 24,
                width: 24,
                mx: 1,
                display: { xs: "none", md: "flex" },
                color: "green",
              }}
            />

            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                color: "black",
                fontWeight: 700,
                textDecoration: "none",
                display: { xs: "none", md: "flex" },
              }}
            >
              {t("navbar.logo")}
            </Typography>
          </Box>

          <Box
            gap={3}
            flex={1}
            flexGrow={1}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Typography
              noWrap
              sx={{
                color: "black",
                fontWeight: 400,
                textDecoration: "none",
                display: { xs: "none", md: "flex" },
              }}
            >
              {/* {t("navbar.username")} */}
              {user ? `${user.userName}` : "Welcome"}
            </Typography>

            <Avatar
              src={avatarImage}
              variant="square"
              sx={{ borderRadius: 3, height: 38 }}
            />

            <Select
              value={language}
              sx={{
                borderRadius: 2,
                textAlign: "center",
                height: 38,
                mx: "24px",
              }}
              onChange={(e) => handleLanguageChange(e.target.value as 0 | 1)}
            >
              <MenuItem value={0}>English</MenuItem>
              <MenuItem value={1}>العربية</MenuItem>
            </Select>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Sidebar />
      </Drawer>
    </>
  );
}
export default Navbar;
