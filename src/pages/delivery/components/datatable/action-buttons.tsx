"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { CourierShipmentListItem } from "@/lib/api/types/delivery";
import {
  usePickShipment,
  usePickUpShipment,
  useDeliverToBranch,
  usePickFromBranch,
  usePickUpFromBranch,
  useDeliverToCustomer,
} from "@/hooks/use-delivery";
import { useUploadMedia } from "@/hooks/use-media";
import Detail from "../../detail";

interface ActionButtonsProps {
  shipment: CourierShipmentListItem;
  onActionComplete: () => void;
}

function ActionButtons({ shipment, onActionComplete }: ActionButtonsProps) {
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"pickup" | "deliver">("pickup");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pickShipment = usePickShipment();
  const pickUpShipment = usePickUpShipment();
  const deliverToBranch = useDeliverToBranch();
  const pickFromBranch = usePickFromBranch();
  const pickUpFromBranch = usePickUpFromBranch();
  const deliverToCustomer = useDeliverToCustomer();
  const uploadMedia = useUploadMedia();

  const isLoading =
    pickShipment.isPending ||
    pickUpShipment.isPending ||
    deliverToBranch.isPending ||
    pickFromBranch.isPending ||
    pickUpFromBranch.isPending ||
    deliverToCustomer.isPending ||
    uploadMedia.isPending;

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Harap pilih file gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPhotoDialog = () => {
    setIsPhotoDialogOpen(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto || !shipment.trackingNumber) {
      toast.error("Foto belum dipilih");
      return;
    }
    try {
      const uploaded = await uploadMedia.mutateAsync(selectedPhoto);
      if (actionType === "pickup") {
        await pickUpShipment.mutateAsync({
          trackingNumber: shipment.trackingNumber,
          data: { pickupProofImageUrl: uploaded.fileUrl },
        });
      } else {
        await deliverToCustomer.mutateAsync({
          trackingNumber: shipment.trackingNumber,
          data: { receiptProofImageUrl: uploaded.fileUrl },
        });
      }
      resetPhotoDialog();
      onActionComplete();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengunggah foto";
      toast.error(errorMessage);
    }
  };

  const openPhotoDialog = (type: "pickup" | "deliver") => {
    setActionType(type);
    setIsPhotoDialogOpen(true);
  };

  const handlePick = () => {
    pickShipment.mutate(shipment.trackingNumber, {
      onSuccess: () => onActionComplete(),
    });
  };

  const handleDeliverToBranch = () => {
    deliverToBranch.mutate(shipment.trackingNumber, {
      onSuccess: () => onActionComplete(),
    });
  };

  const handlePickFromBranch = () => {
    pickFromBranch.mutate(shipment.trackingNumber, {
      onSuccess: () => onActionComplete(),
    });
  };

  const handlePickUpFromBranch = () => {
    pickUpFromBranch.mutate(shipment.trackingNumber, {
      onSuccess: () => onActionComplete(),
    });
  };

  const renderActionButtons = () => {
    if (!shipment.trackingNumber) return null;
    switch (shipment.status) {
      case "READY_TO_PICKUP":
        return (
          <Button
            variant="darkGreen"
            size="sm"
            onClick={handlePick}
            disabled={isLoading}
          >
            Pick
          </Button>
        );
      case "WAITING_FOR_PICKUP":
        return (
          <Button
            variant="darkGreen"
            size="sm"
            onClick={() => openPhotoDialog("pickup")}
            disabled={isLoading}
          >
            <Camera className="w-4 h-4 mr-1" />
            Konfirmasi Pickup
          </Button>
        );
      case "PICKED_UP":
        return (
          <Button
            variant="oranye"
            size="sm"
            onClick={handleDeliverToBranch}
            disabled={isLoading}
          >
            Kirim ke Cabang
          </Button>
        );
      case "IN_TRANSIT":
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePickFromBranch}
            disabled={isLoading}
          >
            Ambil dari Cabang
          </Button>
        );
      case "READY_TO_DELIVER":
        return (
          <Button
            variant="default"
            size="sm"
            onClick={handlePickUpFromBranch}
            disabled={isLoading}
          >
            Siap Kirim
          </Button>
        );
      case "ON_THE_WAY_TO_ADDRESS":
        return (
          <Button
            variant="darkGreen"
            size="sm"
            onClick={() => openPhotoDialog("deliver")}
            disabled={isLoading}
          >
            <Camera className="w-4 h-4 mr-1" />
            Konfirmasi Terkirim
          </Button>
        );
      case "DELIVERED":
        return (
          <Badge variant="darkGreen" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(true)}>
        <Eye className="w-4 h-4 mr-1" />
        Detail
      </Button>
      {renderActionButtons()}
      <Detail
        trackingNumber={shipment.trackingNumber}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="!max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {actionType === "pickup"
                ? "Konfirmasi Pickup"
                : "Konfirmasi Pengiriman"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "pickup"
                ? "Unggah foto paket yang telah dipickup sebagai bukti"
                : "Unggah foto bukti pengiriman ke customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo" className="text-sm font-medium">
                Foto Bukti
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="mt-2"
              />
            </div>
            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={resetPhotoDialog}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="darkGreen"
              onClick={handlePhotoUpload}
              disabled={!selectedPhoto || isLoading}
            >
              {isLoading ? "Mengunggah..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActionButtons;
