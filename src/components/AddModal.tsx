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
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import arLocale from "i18n-iso-countries/langs/ar.json";
import ReactCountryFlag from "react-country-flag";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { queryClient } from "../main";
import { addStudent, EditStudent } from "../lib/http";
import type { Gender, Grade, TableRows } from "../types";
import { useLanguage } from "../hooks/useSession";
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

countries.registerLocale(enLocale);
countries.registerLocale(arLocale);

const AddModal = ({ isOpen, onClose, type, student }: Props) => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");
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

  const countryList = countries.getNames(language === 1 ? "ar" : "en");
  const defaultCountry = countryList["SY"];

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
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {type === "CREATE"
              ? t("addModal.addStudent")
              : t("addModal.modifyStudent")}
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
                  label={t("addModal.firstName")}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      textAlign: i18n.language === "ar" ? "right" : "left",
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
                  label={t("addModal.lastName")}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      textAlign: i18n.language === "ar" ? "right" : "left",
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
                  label={t("addModal.dateOfBirth")}
                  error={Boolean(errors.birthDate)}
                  helperText={errors.birthDate?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      textAlign: i18n.language === "ar" ? "right" : "left",
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
                    {t("addModal.educationalLevel")}
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="educational-label"
                    error={Boolean(errors.grade)}
                    sx={{ backgroundColor: "#F5F5F5", borderRadius: 2 }}
                  >
                    {grades &&
                      grades.map(({ id, translations }) => {
                        const translation = translations?.find(
                          (i) => i.cultureCode === language
                        );
                        const name = translation?.name ?? "Unknown";
                        return (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {" "}
                    {errors.grade?.message}
                  </FormHelperText>
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
                  <InputLabel id="country-label">
                    {t("addModal.country")}
                  </InputLabel>
                  <Select
                    id="country"
                    {...field}
                    labelId="country-label"
                    defaultValue={defaultCountry}
                    error={Boolean(errors.country)}
                    sx={{ backgroundColor: "#F5F5F5", borderRadius: 2 }}
                  >
                    {Object.entries(countryList).map(([code, name]) => (
                      <MenuItem key={code} value={name}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ReactCountryFlag
                            countryCode={code}
                            svg
                            style={{ width: "20px", height: "15px" }}
                          />
                          {name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {" "}
                    {errors.country?.message}
                  </FormHelperText>
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
                  label={t("addModal.city")}
                  margin="normal"
                  error={Boolean(errors.city)}
                  helperText={errors.city?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      textAlign: i18n.language === "ar" ? "right" : "left",
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
                <FormControl fullWidth margin="normal">
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="SY"
                    placeholder={t("addModal.mobile")}
                    onChange={(value) => field.onChange(value)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: "#F5F5F5",
                      height: "56px",
                      padding: "10px",
                      // marginTop: "16px",
                      border: errors.phone
                        ? "1px solid #D32F2F"
                        : "1px solid #C0C0C0",
                    }}
                    inputProps={{
                      style: {
                        width: "100%",
                      },
                    }}
                    countrySelectProps={{
                      style: {
                        border: "none",
                        backgroundColor: "transparent",
                        outline: "none",
                      },
                    }}
                  />
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {" "}
                    {errors.phone?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-label">
                    {t("addModal.gender")}
                  </InputLabel>
                  <Select
                    {...field}
                    id="gender"
                    labelId="gender-label"
                    sx={{ background: "#F5F5F5", borderRadius: 2 }}
                    error={Boolean(errors.gender)}
                  >
                    {genders &&
                      genders.map(({ id, translations }) => {
                        const translation = translations?.find(
                          (i) => i.cultureCode === language
                        );
                        const name = translation?.name ?? "Unknown";
                        return (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText sx={{ color: "#D32F2F" }}>
                    {" "}
                    {errors.gender?.message}
                  </FormHelperText>
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
                label={t("addModal.note")}
                margin="normal"
                inputProps={{ style: { height: 80, textAlign: "start" } }}
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
              {type === "CREATE" ? t("addModal.add") : t("addModal.modify")}
            </Button>

            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={onClose}
              disabled={isPending || isEditPending}
              sx={{ borderRadius: 3, textTransform: "none" }}
            >
              {t("addModal.cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        message={
          type === "CREATE"
            ? IsAddError
              ? t("addModal.error")
              : t("addModal.addSuccess")
            : isEditError
            ? t("addModal.error")
            : t("addModal.editSuccess")
        }
        open={isActionComplete}
        onClose={dismisHandler}
        autoHideDuration={5000}
      />
    </>
  );
};

export default AddModal;
