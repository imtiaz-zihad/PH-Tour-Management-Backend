import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: z.string({ message: "Email must be a string" }),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters long and contain at least one letter and one number"
    ),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z
    .string()
    .regex(/.{5,100}/, "Address must be between 5 and 100 characters"),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .optional(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters long and contain at least one letter and one number"
    )
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),

  isActive: z.boolean({ message: "isActive must be a boolean" }).optional(),

  isDeleted: z.boolean({ message: "isDeleted must be a boolean" }).optional(),

  isVerified: z.boolean({ message: "isVerified must be a boolean" }).optional(),

  address: z
    .string()
    .regex(/.{5,100}/, "Address must be between 5 and 100 characters")
    .optional(),
});
