import { z } from "zod";

export const loginScheme = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type LoginData = z.infer<typeof loginScheme>;

export const studentScheme = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long" }),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date",
  }),
  city: z.string().min(2, { message: "City name is required" }),
  country: z.string().min(2, { message: "Country name is required" }),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, { message: "Please enter a valid phone number" }),
  grade: z.string().min(1, { message: "Grade is required" }),
  gender: z.string().min(1, {
    message: "Please select a valid gender",
  }),
  remarks: z.string().optional(),
});

export type StudentSchemeData = z.infer<typeof studentScheme>;
