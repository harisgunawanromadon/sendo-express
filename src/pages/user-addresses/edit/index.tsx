import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Upload, MapPin, Slash } from "lucide-react";
import { useRef } from "react";
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
  const userAddressId = addressId ? parseInt(addressId) : 0;

  const {
    data: userAddress,
    isLoading: fetchLoading,
    error: fetchError,
  } = useUserAddress(userAddressId);

  const updateUserAddressMutation = useUpdateUserAddress();
  const [photoPreview, setPhotoPreview] = useState<string>("");
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
      photo: undefined,
    },
  });

  useEffect(() => {
    if (!addressId || isNaN(userAddressId)) {
      toast.error("ID alamat tidak valid");
      navigate("/user-addresses");
    }
  }, [addressId, userAddressId, navigate]);

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
        tag: userAddress.tag,
        label: userAddress.label,
        photo: userAddress.photo ?? undefined,
      });
      if (userAddress.photo) {
        setPhotoPreview(userAddress.photo);
      }
    }
  }, [userAddress, reset]);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPhotoPreview(base64);
        setValue("photo", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview("");
    setValue("photo", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UpdateUserAddressFormData) => {
    updateUserAddressMutation.mutate(
      {
        id: userAddressId,
        data: {
          address: data.address,
          tag: data.tag,
          label: data.label,
          photo: data.photo,
        },
      },
      {
        onSuccess: () => navigate("/user-addresses"),
      },
    );
  };

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
            {/* Left side - Form Fields */}
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

              <div className="pt-4">
                <Button
                  variant="darkGreen"
                  type="submit"
                  disabled={updateUserAddressMutation.isPending}
                  className="w-full"
                >
                  {updateUserAddressMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </div>

            {/* Right side - Image Preview */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Gambar Patokan
                </Label>

                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Address preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                      onClick={removePhoto}
                    >
                      ×
                    </Button>
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

                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {photoPreview ? "Ganti Gambar" : "Pilih Gambar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
