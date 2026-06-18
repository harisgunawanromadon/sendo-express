import { z } from "zod";

export const createUserAddressSchema = z.object({
  address: z
    .string()
    .min(3, "Alamat minimal 3 karakter")
    .max(255, "Alamat maksimal 255 karakter"),

  tag: z
    .string()
    .min(1, "Patokan wajib diisi")
    .max(100, "Patokan maksimal 100 karakter")
    .optional(),
  label: z
    .string()
    .min(1, "Label wajib diisi")
    .max(50, "Nama alamat maksimal 50 karakter")
    .optional(),
  photo: z.string().min(1, "Foto wajib diisi").optional(),
});

export const updateUserAddressSchema = z.object({
  address: z.string().max(255, "Alamat maksimal 255 karakter").optional(),
  tag: z.string().max(100, "Patokan maksimal 100 karakter").optional(),
  label: z
    .string()
    .max(50, "Nama alamat maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  photo: z.string().optional(),
});

export type CreateUserAddressFormData = z.infer<typeof createUserAddressSchema>;
export type UpdateUserAddressFormData = z.infer<typeof updateUserAddressSchema>;
