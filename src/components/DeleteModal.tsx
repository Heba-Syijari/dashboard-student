import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { queryClient } from "../main";
import { deleteStudent } from "../lib/http";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const DeleteModal = ({ isOpen, onClose }: Props) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-student"],
    mutationFn: deleteStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-students"] });
      onClose();
      params.delete("student-id");
      navigate({ search: params.toString() });
    },
  });

  const confirmHandler = () => {
    const studentId = params.get("student-id")!;
    mutate({ id: studentId, token: token! });
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
        }}
      >
        <Box
          height={150}
          display="flex"
          borderRadius={3}
          bgcolor="#F34235"
          alignItems="center"
          justifyContent="center"
        >
          <InfoOutlinedIcon
            fontSize="large"
            sx={{ color: "#fff", width: 66, height: 66 }}
          />
        </Box>

        <Box py={6} px={2}>
          <Typography
            color="red"
            variant="h5"
            component="h1"
            sx={{ mb: 2 }}
            textAlign="center"
          >
            Are you sure ?
          </Typography>

          <Typography
            component="p"
            sx={{ mb: 1, fontSize: 14, fontWeight: 400 }}
            textAlign="center"
          >
            Are you sure you want to delete this student's information?
          </Typography>

          <Typography
            color="red"
            component="p"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            This action cannot be undone.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} marginY={3}>
            <Button
              fullWidth
              variant="contained"
              disabled={isPending}
              onClick={confirmHandler}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                height: 48,
                bgcolor: "#F34235",
              }}
            >
              Delete
            </Button>

            <Button
              fullWidth
              color="error"
              variant="outlined"
              onClick={onClose}
              disabled={isPending}
              sx={{ borderRadius: 2, textTransform: "none", height: 48 }}
            >
              Cancle
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
