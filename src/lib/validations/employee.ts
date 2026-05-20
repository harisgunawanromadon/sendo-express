import { z } from "zod";

// Base employee schema
export const employeeBaseSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),

  email: z.string().email("Email tidak valid"),

  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),

  branchId: z.coerce.number().min(1, "Pilih cabang"),

  roleId: z.coerce.number().min(1, "Pilih tipe karyawan"),
});

// Schema for creating employee
export const createEmployeeSchema = employeeBaseSchema
  .extend({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(100, "Password maksimal 100 karakter")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
        "Password harus mengandung huruf dan angka",
      ),

    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter")
      .max(100, "Konfirmasi password maksimal 100 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirmPassword"],
  });

// Schema for updating employee
// export const updateEmployeeSchema = employeeBaseSchema.extend({
//   password: z
//     .string()
//     .min(8, "Password minimal 8 karakter")
//     .optional()
//     .or(z.literal("")),

//   confirmPassword: z.string().optional().or(z.literal("")),
// });

// Type exports
export type EmployeeBaseFormData = z.infer<typeof employeeBaseSchema>;
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
// export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;
