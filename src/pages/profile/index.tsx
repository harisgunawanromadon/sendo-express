import { Button } from "@/components/ui/button";
import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileFormData,
  type UpdatePasswordFormData,
} from "@/lib/validations/profile";
import toast, { Toaster } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/use-profile";
import { useUploadMedia, useRemoveMedia } from "@/hooks/use-media";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);

  // Use custom meta hook instead of react-helmet
  useMeta(META_DATA.profile);

  // Get current user data
  const { user } = useAuth();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const uploadMediaMutation = useUploadMedia();
  const removeMediaMutation = useRemoveMedia();

  // Profile form setup
  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      avatar: "",
    },
  });

  // Password form setup
  const passwordForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Set initial values when user data is available
  const { reset: resetProfile } = profileForm;
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user, resetProfile]);

  // Handle avatar upload
  const handleAvatarSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang dipilih harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar tidak boleh lebih dari 5MB");
      return;
    }

    setSelectedAvatar(file);

    // Preview lokal dulu
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload ke server
    try {
      const result = await uploadMediaMutation.mutateAsync(file);
      profileForm.setValue("avatar", result.fileUrl);
      setUploadedPublicId(result.publicId);
    } catch {
      // Error sudah di-handle di hook
      setSelectedAvatar(null);
      setAvatarPreview(user?.avatar || "");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // handle avatar remove
  const handleRemoveAvatar = () => {
    const resetLocalState = () => {
      setSelectedAvatar(null);
      setAvatarPreview("");
      profileForm.setValue("avatar", "");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (uploadedPublicId) {
      removeMediaMutation.mutate(String(uploadedPublicId), {
        onSuccess: () => {
          setUploadedPublicId(null);
          updateProfileMutation.mutate(
            { fullName: user?.fullName || "", avatar: "" },
            { onSuccess: resetLocalState },
          );
        },
      });
    } else {
      updateProfileMutation.mutate(
        { fullName: user?.fullName || "", avatar: "" },
        { onSuccess: resetLocalState },
      );
    }
  };

  // Handle profile update
  const onProfileSubmit = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password update
  const onPasswordSubmit = (data: UpdatePasswordFormData) => {
    updatePasswordMutation.mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
      {
        onSuccess: () => passwordForm.reset(),
      },
    );
  };

  const isUploading = uploadMediaMutation.isPending;

  return (
    <>
      <Page title="Profil">
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Update Card */}
          <Card>
            <CardHeader>
              <CardTitle>Perbarui Profil</CardTitle>
              <CardDescription>Perbarui informasi profil Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <img
                      src={avatarPreview || "/images/vespa-tiger.jpg"}
                      alt="Profile"
                      className="size-[100px] rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {selectedAvatar && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={handleRemoveAvatar}
                        disabled={
                          removeMediaMutation.isPending ||
                          updateProfileMutation.isPending
                        }
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="darkGreen"
                      className="px-6 py-2 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Ubah Foto"}
                    </Button>
                    <input
                      aria-label="Upload avatar"
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Full Name Field */}
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nama Lengkap
                  </Label>
                  <Input
                    {...profileForm.register("fullName")}
                    id="fullName"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Masukkan Nama Lengkap"
                  />
                  {profileForm.formState.errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  type="submit"
                  variant="darkGreen"
                  className="py-3 cursor-pointer"
                  disabled={updateProfileMutation.isPending || isUploading}
                >
                  {updateProfileMutation.isPending
                    ? "Updating..."
                    : "Perbarui Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Update Card */}
          <Card>
            <CardHeader>
              <CardTitle>Perbarui Kata Sandi</CardTitle>
              <CardDescription>
                Perbarui kata sandi Anda untuk keamanan akun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                {/* Current Password Field */}
                <div>
                  <Label
                    htmlFor="oldPassword"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Kata Sandi Lama
                  </Label>
                  <Input
                    {...passwordForm.register("oldPassword")}
                    id="oldPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.oldPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.oldPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Kata Sandi Baru
                  </Label>
                  <Input
                    {...passwordForm.register("newPassword")}
                    id="newPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <Label
                    htmlFor="confirmNewPassword"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <Input
                    {...passwordForm.register("confirmNewPassword")}
                    id="confirmNewPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {passwordForm.formState.errors.confirmNewPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  type="submit"
                  variant="darkGreen"
                  className="py-3 cursor-pointer"
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending
                    ? "Updating..."
                    : "Perbarui Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Toaster position="top-right" />
      </Page>
    </>
  );
};

export default Index;
