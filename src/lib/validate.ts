import { z } from "zod";
import i18n from "../i18n";

export const loginScheme = z.object({
  userName: z
    .string()
    .min(3, { message: i18n.t("validation.usernameMinLength") }),
  password: z
    .string()
    .min(6, { message: i18n.t("validation.passwordMinLength") }),
});

export type LoginData = z.infer<typeof loginScheme>;

export const studentScheme = z.object({
  firstName: z
    .string()
    .min(3, { message: i18n.t("validation.firstNameMinLength") }),
  lastName: z
    .string()
    .min(3, { message: i18n.t("validation.lastNameMinLength") }),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: i18n.t("validation.invalidDate"),
  }),
  city: z.string().min(2, { message: i18n.t("validation.cityRequired") }),
  country: z.string().min(2, { message: i18n.t("validation.countryRequired") }),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: i18n.t("validation.invalidPhone") }),
  grade: z.string().min(1, { message: i18n.t("validation.gradeRequired") }),
  gender: z.string().min(1, {
    message: i18n.t("validation.genderRequired"),
  }),
  remarks: z.string().optional(),
});

export type StudentSchemeData = z.infer<typeof studentScheme>;
