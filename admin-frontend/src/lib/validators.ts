import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const userCreateSchema = z.object({
  full_name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
  is_admin: z.boolean(),
  is_superuser: z.boolean(),
  is_active: z.boolean(),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const userEditSchema = z.object({
  full_name: z.string().min(1).max(255),
  email: z.string().email(),
  is_admin: z.boolean(),
  is_superuser: z.boolean(),
  is_active: z.boolean(),
  password: z.string().min(8).optional().or(z.literal("")),
});
export type UserEditInput = z.infer<typeof userEditSchema>;
