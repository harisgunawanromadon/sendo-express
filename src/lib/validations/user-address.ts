import { z } from "zod";

// Validation schema for user address form
export const userAddressSchema = z.object({
  address: z
    .string()
    .min(1, "Alamat adalah wajib")
    .min(3, "Alamat minimal 3 karakter")
    .max(255, "Alamat maksimal 255 karakter"),
  tag: z
    .string()
    .min(1, "Patokan adalah wajib")
    .max(100, "Patokan maksimal 100 karakter"),
  label: z
    .string()
    .min(1, "Nama alamat adalah wajib")
    .max(50, "Nama alamat maksimal 50 karakter"),
});

// Type inference for form data
export type UserAddressFormData = z.infer<typeof userAddressSchema>;

// Validation schema for create request (includes optional photo)
export const createUserAddressSchema = userAddressSchema.extend({
  photo: z.string().optional(),
});

// Validation schema for update request (includes optional photo)
export const updateUserAddressSchema = userAddressSchema.extend({
  photo: z.string().optional(),
});

export type CreateUserAddressFormData = z.infer<typeof createUserAddressSchema>;
export type UpdateUserAddressFormData = z.infer<typeof updateUserAddressSchema>;
