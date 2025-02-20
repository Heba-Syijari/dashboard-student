import {
  Box,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { loginEvent } from "../lib/http";
import LoginImage from "../assets/image.png";
import { LoginData, loginScheme } from "../lib/validate";
import { useLanguage } from "../hooks/useSession";

const LoginPage = () => {
  const navigate = useNavigate();

  const { language, onChangeLanguage } = useLanguage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginScheme),
    values: { password: "", userName: "" },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginEvent,
    onSuccess: ({ token }) => {
      localStorage.setItem("token", token);
      navigate("dashboard");
    },
  });

  const submitHandler = ({ password, userName }: LoginData) => {
    mutate({ password, userName });
  };

  return (
    <Container
      maxWidth="lg"
      component="main"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            width: "40%",
            p: 2,
          }}
        >
          <Select
            value={language}
            sx={{
              borderRadius: 2,
              textAlign: "center",
              height: 38,
              width: 120,
              mb: 2,
            }}
            onChange={(e) => onChangeLanguage(e.target.value as 0 | 1)}
          >
            <MenuItem value={0}>English</MenuItem>
            <MenuItem value={1}>Arabic</MenuItem>
          </Select>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img alt="login" src={LoginImage} style={{ maxWidth: "80%" }} />
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            py: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2148C0",
            borderRadius: 3,
          }}
        >
          <Box
            component="form"
            sx={{
              p: 3,
              m: 1,
              width: "80%",
              borderRadius: 3,
              backgroundColor: "white",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Login
            </Typography>

            <Controller
              name="userName"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <>
                  <InputLabel htmlFor="username">Username</InputLabel>

                  <TextField
                    fullWidth
                    name={name}
                    value={value}
                    id="username"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: "rgba(119, 116, 116, 0.1)",
                        height: 40,
                        mb: 1,
                      },
                    }}
                    onChange={onChange}
                    error={Boolean(errors.userName)}
                    helperText={errors.userName?.message}
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { name, value, onChange } }) => (
                <>
                  <InputLabel htmlFor="password" sx={{ mt: 2 }}>
                    Password
                  </InputLabel>

                  <TextField
                    type="password"
                    fullWidth
                    name={name}
                    value={value}
                    id="password"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: "rgba(119, 116, 116, 0.1)",
                        height: 40,
                        mb: 1,
                      },
                    }}
                    onChange={onChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                </>
              )}
            />

            <Button
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              disabled={isPending}
              sx={{
                mt: 3,
                mb: 2,
                p: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
              onClick={handleSubmit(submitHandler)}
            >
              Sign In
            </Button>

            {isError && (
              <p style={{ color: "red" }}>
                {/* @ts-ignore */}
                {error.response.data}
              </p>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
