import { mediaService } from "@/lib/api/services/media";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadSingle(file),
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengunggah gambar. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const useUploadMultipleMedia = () => {
  return useMutation({
    mutationFn: (files: File[]) => mediaService.uploadMultiple(files),
    onSuccess: () => {
      toast.success("Gambar berhasil diunggah!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal mengunggah gambar. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};

export const useRemoveMedia = () => {
  return useMutation({
    mutationFn: (publicId: string) => mediaService.removeMedia(publicId),
    onSuccess: () => {
      toast.success("Gambar berhasil dihapus!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Gagal menghapus gambar. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
};
