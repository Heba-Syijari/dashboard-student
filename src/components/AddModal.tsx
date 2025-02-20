import { useState } from "react";

import {
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  Snackbar,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { queryClient } from "../main";
import { addStudent, EditStudent } from "../lib/http";
import type { Gender, Grade, TableRows } from "../types";
import { useLanguage, useSession } from "../hooks/useSession";
import { studentScheme, StudentSchemeData } from "../lib/validate";

type Props = {
  isOpen: boolean;
  student?: TableRows;
  onClose: () => void;
  type: "EDIT" | "CREATE";
};

const INITIAL_VALUE = {
  city: "",
  grade: "",
  phone: "",
  gender: "",
  country: "",
  remarks: "",
  lastName: "",
  firstName: "",
  birthDate: "",
};

const AddModal = ({ isOpen, onClose, type, student }: Props) => {
  const { token } = useSession();
  const { language } = useLanguage();
  const [isActionComplete, setIsActionComplete] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const grades = queryClient.getQueryData<Grade[]>(["all-grades"]);
  const genders = queryClient.getQueryData<Gender[]>(["all-genders"]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchemeData>({
    resolver: zodResolver(studentScheme),
    values:
      type === "EDIT" && student
        ? {
            ...student,
            grade: student.gradeId,
            gender: student.genderId,
            birthDate: student.birthDate.slice(0, 10),
          }
        : INITIAL_VALUE,
  });

  const {
    isPending,
    mutate: addMutate,
    isError: IsAddError,
  } = useMutation({
    mutationKey: ["add-student"],
    mutationFn: addStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-students"] });
      onClose();
      setIsActionComplete(true);
    },
    onError: () => {
      onClose();
      setIsActionComplete(true);
    },
  });

  const {
    mutate: editMutate,
    isError: isEditError,
    isPending: isEditPending,
  } = useMutation({
    mutationKey: ["edit-student"],
    mutationFn: EditStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-students"] });
      onClose();
      setIsActionComplete(true);
    },
  });

  const submitHandler = (values: StudentSchemeData) => {
    if (type === "CREATE") {
      addMutate({ student: values, token: token! });
    } else {
      editMutate({ student: { id: student!.id, ...values }, token: token! });
    }
  };

  const dismisHandler = () => {
    setIsActionComplete(false);
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box
          component="form"
          sx={{
            p: 4,
            width: isSmallScreen ? "90%" : 670,
            top: "50%",
            left: "50%",
            boxShadow: 24,
            borderRadius: 5,
            position: "absolute",
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {type === "CREATE" ? "Add Student" : "Modify Student Data"}
          </Typography>

          <Box
            display="flex"
            gap={2}
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="firstName"
                  margin="normal"
                  label="First Name"
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="lastName"
                  margin="normal"
                  label="Last Name"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box
            display="flex"
            gap={2}
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  margin="normal"
                  id="dateOfBirth"
                  label="Date of Birth"
                  error={Boolean(errors.birthDate)}
                  helperText={errors.birthDate?.message}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              )}
            />

            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="educational-label">
                    Educational Level
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="educational-label"
                    error={Boolean(errors.grade)}
                    // helperText={errors.grade?.message}
                    sx={{ backgroundColor: "#F5F5F5", borderRadius: 2 }}
                  >
                    {grades &&
                      grades.map(({ id, translations }) => {
                        return (
                          <MenuItem key={id} value={id}>
                            {
                              translations.find(
                                (i) => i.cultureCode === language
                              )!.name
                            }
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box
            display="flex"
            gap={2}
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    id="country"
                    {...field}
                    labelId="country-label"
                    error={Boolean(errors.country)}
                    // helperText={errors.country?.message}
                    sx={{ backgroundColor: "#F5F5F5", borderRadius: 2 }}
                  >
                    <MenuItem value="Syria">Syria</MenuItem>
                    <MenuItem value="USA">Saudi</MenuItem>
                    <MenuItem value="Egypt">Egypt</MenuItem>
                    <MenuItem value="Canada">Türkiye</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="city"
                  label="City"
                  margin="normal"
                  error={Boolean(errors.city)}
                  helperText={errors.city?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box
            display="flex"
            gap={2}
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone"
                  label="Mobile"
                  margin="normal"
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    {...field}
                    id="gender"
                    labelId="gender-label"
                    sx={{ background: "#F5F5F5", borderRadius: 2 }}
                    error={Boolean(errors.gender)}
                    // helperText={errors.gender?.message}
                  >
                    {genders &&
                      genders.map(({ id, translations }) => {
                        return (
                          <MenuItem key={id} value={id}>
                            {
                              translations.find(
                                (i) => i.cultureCode === language
                              )!.name
                            }
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Controller
            control={control}
            name="remarks"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                id="note"
                label="Note"
                margin="normal"
                inputProps={{ style: { height: 100, textAlign: "start" } }}
              />
            )}
          />

          <Box
            mt={2}
            gap={2}
            display="flex"
            justifyContent="space-between"
            flexDirection={isSmallScreen ? "column" : "row"}
          >
            <Button
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              disabled={isPending || isEditPending}
              onClick={handleSubmit(submitHandler)}
              sx={{ borderRadius: 3, textTransform: "none" }}
            >
              {type === "CREATE" ? "Add" : "Modify"}
            </Button>

            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={onClose}
              disabled={isPending || isEditPending}
              sx={{ borderRadius: 3, textTransform: "none" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        message={
          type === "CREATE"
            ? IsAddError
              ? "Add Student Successfully!"
              : "Some thing went wrong, Please try again."
            : isEditError
            ? "Some thing went wrong, Please try again."
            : "Edit Student Successfully!"
        }
        open={isActionComplete}
        onClose={dismisHandler}
        autoHideDuration={5000}
      />
    </>
  );
};

export default AddModal;
