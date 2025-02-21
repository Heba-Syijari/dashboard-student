import {
  Box,
  Button,
  Modal,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import logoutImage from "../assets/logout.svg";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SignoutModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const signoutHandler = () => {
    onClose();
    localStorage.setItem("token", "");
    navigate("/");
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        component="div"
        sx={{
          width: isSmallScreen ? "90%" : 483,
          top: "50%",
          left: "50%",
          boxShadow: 24,
          borderRadius: 3,
          overflow: "hidden",
          position: "absolute",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <Box
          height={150}
          display="flex"
          borderRadius={3}
          bgcolor="#1F7BF4"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            src={logoutImage}
            variant="square"
            sx={{
              height: 66,
              width: 66,
            }}
          />
        </Box>

        <Box py={6} px={4}>
          <Typography
            variant="h5"
            component="h1"
            color="#1F7BF4"
            sx={{ mb: 2, fontWeight: "bold" }}
            textAlign="center"
          >
            {t("signoutModal.signOut")}
          </Typography>

          <Typography component="p" sx={{ mb: 6 }} textAlign="center">
            {t("signoutModal.confirmMessage")}
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} pb={2}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={signoutHandler}
              sx={{ borderRadius: 2, textTransform: "none", height: 48 }}
            >
              {t("signoutModal.signOut")}
            </Button>

            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={onClose}
              // disabled={isPending}
              sx={{ borderRadius: 2, textTransform: "none", height: 48 }}
            >
              {t("signoutModal.cancel")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignoutModal;
