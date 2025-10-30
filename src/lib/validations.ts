import { z } from "zod";

// Authentication validation schemas
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
});

export const loginSchema = authSchema.omit({ name: true });
export const signupSchema = authSchema.required({ name: true });

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Search validation schema
export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s-_]+$/, "Search query can only contain letters, numbers, spaces, hyphens, and underscores"),
});

// Medicine reservation schema
export const reservationSchema = z.object({
  medicineId: z.string().uuid("Invalid medicine ID"),
  pharmacyId: z.string().uuid("Invalid pharmacy ID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Maximum quantity is 100"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// Payment validation schema
export const paymentSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(1, "Minimum amount is 1 KES")
    .max(1000000, "Maximum amount is 1,000,000 KES"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+254|0)?[17]\d{8}$/, "Please enter a valid Kenyan phone number")
    .transform(phone => {
      // Normalize phone number to international format
      if (phone.startsWith('0')) {
        return '+254' + phone.slice(1);
      }
      if (!phone.startsWith('+')) {
        return '+254' + phone;
      }
      return phone;
    }),
});

// Export types for TypeScript
export type AuthFormData = z.infer<typeof authSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type ReservationFormData = z.infer<typeof reservationSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;