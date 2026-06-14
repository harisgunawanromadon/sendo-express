import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, Slash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserAddressSchema,
  type CreateUserAddressFormData,
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
import { useNavigate } from "react-router-dom";
import { useCreateUserAddress } from "@/hooks/use-user-address";
import { useUploadMedia, useRemoveMedia } from "@/hooks/use-media";
import { toast } from "react-hot-toast";

export default function AddUserAddressPage() {
  useMeta(META_DATA["user-addresses-add"]);
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createUserAddressMutation = useCreateUserAddress();
  const uploadMediaMutation = useUploadMedia();
  const removeMediaMutation = useRemoveMedia();

  const isUploading = uploadMediaMutation.isPending;
  const isRemoving = removeMediaMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateUserAddressFormData>({
    resolver: zodResolver(createUserAddressSchema),
    defaultValues: {
      address: "",
      tag: "",
      label: "",
      photo: "",
    },
  });

  const resetPhotoState = () => {
    setPhotoPreview("");
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

    if (uploadedPublicId) {
      try {
        await removeMediaMutation.mutateAsync(uploadedPublicId);
      } catch {
        // lanjutkan meski hapus lama gagal
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await uploadMediaMutation.mutateAsync(file);
      setValue("photo", result.fileUrl);
      setUploadedPublicId(result.publicId);
      toast.success("Gambar berhasil diunggah!");
    } catch {
      resetPhotoState();
    }
  };

  const handleRemovePhoto = () => {
    if (isUploading || isRemoving) return;

    if (uploadedPublicId) {
      removeMediaMutation.mutate(uploadedPublicId, {
        onSuccess: () => resetPhotoState(),
      });
    } else {
      resetPhotoState();
    }
  };

  const onAddressSubmit = (data: CreateUserAddressFormData) => {
    createUserAddressMutation.mutate(data, {
      onSuccess: () => navigate("/user-addresses"),
    });
  };

  const isSaveDisabled =
    createUserAddressMutation.isPending || isUploading || isRemoving;

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
            <BreadcrumbPage>Tambah Alamat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-3xl font-bold">Tambah Alamat 🏠</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <form onSubmit={handleSubmit(onAddressSubmit)}>
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
                  Label alamat
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
                  {createUserAddressMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan"}
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
    </main>
  );
}
