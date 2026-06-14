import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Upload, MapPin, Slash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserAddressSchema,
  type UpdateUserAddressFormData,
} from "@/lib/validations/user-address";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { Textarea } from "@/components/ui/textarea";
import { useUserAddress, useUpdateUserAddress } from "@/hooks/use-user-address";
import { useUploadMedia, useRemoveMedia } from "@/hooks/use-media";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-8 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user-addresses">Alamat Saya</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash size={16} />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Alamat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4">
        <h1 className="text-3xl font-bold">Edit Alamat 🏠</h1>
      </div>
      {children}
    </main>
  );
}

export default function EditUserAddressPage() {
  useMeta(META_DATA["user-addresses-edit"]);
  const navigate = useNavigate();
  const { id: addressId } = useParams();

  const userAddressId =
    addressId && !isNaN(parseInt(addressId)) ? parseInt(addressId) : null;

  const {
    data: userAddress,
    isLoading: fetchLoading,
    error: fetchError,
  } = useUserAddress(userAddressId ?? 0);

  const updateUserAddressMutation = useUpdateUserAddress();
  const uploadMediaMutation = useUploadMedia();
  const removeMediaMutation = useRemoveMedia();

  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateUserAddressFormData>({
    resolver: zodResolver(updateUserAddressSchema),
    defaultValues: {
      address: "",
      tag: "",
      label: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (!userAddressId) {
      toast.error("ID alamat tidak valid");
      navigate("/user-addresses");
    }
  }, [userAddressId, navigate]);

  useEffect(() => {
    if (fetchError) {
      toast.error("Gagal memuat data alamat");
      navigate("/user-addresses");
    }
  }, [fetchError, navigate]);

  useEffect(() => {
    if (userAddress) {
      reset({
        address: userAddress.address,
        tag: userAddress.tag ?? "",
        label: userAddress.label ?? "",
        photo: "",
      });
      const existingPhoto = userAddress.photo ?? "";
      setPhotoPreview(existingPhoto);
      setOriginalPhotoUrl(existingPhoto);
    }
  }, [userAddress, reset]);

  const resetPhotoToOriginal = () => {
    setPhotoPreview(originalPhotoUrl);
    setUploadedPhotoUrl(null);
    setUploadedPublicId(null);
    setValue("photo", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePhotoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar tidak boleh lebih dari 5MB.");
      return;
    }

    // Jika sebelumnya sudah upload foto baru (bukan foto original), hapus dulu
    if (uploadedPublicId) {
      try {
        await removeMediaMutation.mutateAsync(uploadedPublicId);
        setUploadedPublicId(null);
        setUploadedPhotoUrl(null);
      } catch {
        // lanjutkan meski gagal hapus
      }
    }

    // Preview lokal segera
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await uploadMediaMutation.mutateAsync(file);
      setUploadedPhotoUrl(result.fileUrl);
      setUploadedPublicId(result.publicId);
      setValue("photo", result.fileUrl);
      toast.success("Gambar berhasil diunggah!");
    } catch {
      resetPhotoToOriginal();
    }
  };

  const handleRemovePhoto = () => {
    const isUploading = uploadMediaMutation.isPending;
    const isRemoving = removeMediaMutation.isPending;
    if (isUploading || isRemoving) return;

    if (uploadedPublicId) {
      removeMediaMutation.mutate(uploadedPublicId, {
        onSuccess: () => resetPhotoToOriginal(),
      });
    } else if (photoPreview === originalPhotoUrl && originalPhotoUrl) {
      setPhotoPreview("");
      setValue("photo", "REMOVE");
    } else {
      setPhotoPreview("");
      setValue("photo", "");
    }
  };

  const onSubmit = (data: UpdateUserAddressFormData) => {
    if (!userAddressId) return;

    const payload: Record<string, unknown> = {};

    if (data.address?.trim()) payload.address = data.address.trim();
    if (data.tag?.trim()) payload.tag = data.tag.trim();
    if (data.label?.trim()) payload.label = data.label.trim();

    if (uploadedPhotoUrl) {
      payload.photo = uploadedPhotoUrl;
    } else if (data.photo === "REMOVE") {
      payload.photo = null;
    }
    // else: tidak ada perubahan foto, field photo tidak dikirim sama sekali

    updateUserAddressMutation.mutate(
      { id: userAddressId, data: payload },
      { onSuccess: () => navigate("/user-addresses") },
    );
  };

  const isUploading = uploadMediaMutation.isPending;
  const isRemoving = removeMediaMutation.isPending;
  const isSaveDisabled =
    updateUserAddressMutation.isPending || isUploading || isRemoving;

  if (fetchLoading) {
    return (
      <PageShell>
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col justify-center">
              <Skeleton className="h-64 w-full" />
              <div className="mt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form Fields */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Alamat Saya
                </Label>
                <div className="relative">
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat penjemputan"
                    {...register("address")}
                    rows={3}
                    className="w-full border-gray-300 rounded-lg resize-none"
                  />
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-cyan-500" />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tag"
                  className="text-sm font-medium text-gray-700"
                >
                  Patokan
                </Label>
                <Input
                  id="tag"
                  placeholder="Masukkan patokan alamat kamu"
                  {...register("tag")}
                  className="w-full border-gray-300 rounded-lg"
                />
                {errors.tag && (
                  <p className="text-sm text-red-600">{errors.tag.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="label"
                  className="text-sm font-medium text-gray-700"
                >
                  Nama Alamat
                </Label>
                <Input
                  id="label"
                  placeholder="Contoh: Sekolah, Rumah Ibu"
                  {...register("label")}
                  className="w-full border-gray-300 rounded-lg"
                />
                {errors.label && (
                  <p className="text-sm text-red-600">{errors.label.message}</p>
                )}
              </div>

              <input type="hidden" {...register("photo")} />

              <div className="pt-4">
                <Button
                  variant="darkGreen"
                  type="submit"
                  disabled={isSaveDisabled}
                  className="w-full"
                >
                  {updateUserAddressMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </div>

            {/* Right: Gambar Patokan */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Gambar Patokan
                </Label>

                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Pratinjau patokan alamat"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                        <p className="text-white text-sm font-medium">
                          Mengunggah...
                        </p>
                      </div>
                    )}
                    {!isUploading && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        onClick={handleRemovePhoto}
                        disabled={isRemoving}
                        aria-label="Hapus gambar"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex flex-col justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-500 text-center">
                        <p>Tambahkan gambar patokan rumah kamu 🏠</p>
                        <p>agar kurir dapat menemukan lokasi kamu</p>
                        <p>dengan cepat dan tepat 📍</p>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading || isRemoving}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {isUploading
                    ? "Mengunggah..."
                    : isRemoving
                      ? "Menghapus..."
                      : photoPreview
                        ? "Ganti Gambar"
                        : "Pilih Gambar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
