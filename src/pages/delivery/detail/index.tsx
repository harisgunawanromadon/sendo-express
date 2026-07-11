import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Box, I3DCubeScan, TruckTime } from "iconsax-reactjs";
import { useCourierShipment } from "@/hooks/use-delivery";
import {
  getStatusBadgeVariant,
  getStatusIcon,
  getStatusLabel,
} from "@/lib/utils/status-utils";
import { Loader2 } from "lucide-react";

interface DetailProps {
  trackingNumber: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const Detail = ({ trackingNumber, isOpen, onClose }: DetailProps) => {
  const { data: shipment, isLoading } = useCourierShipment(
    trackingNumber ?? "",
    isOpen,
  );

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} kg`;
    }
    return `${grams} g`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold">
            Detail Pengiriman
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data pengiriman...</p>
          </div>
        )}

        {!isLoading && shipment && (
          <div className="space-y-4 text-sm">
            {/* Info Paket */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-md text-white shrink-0">
                  <I3DCubeScan size={16} variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">No. Resi</p>
                  <p className="font-medium text-sm truncate">
                    {shipment.trackingNumber || "Belum tersedia"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-md text-white shrink-0">
                  <Box size={16} variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Jenis Paket</p>
                  <p className="font-medium text-sm capitalize">
                    {shipment.packageType || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-md text-white shrink-0">
                  <Box size={16} variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Berat</p>
                  <p className="font-medium text-sm">
                    {formatWeight(shipment.weight || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-md text-white shrink-0">
                  <Box size={16} variant="Bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Ongkir</p>
                  <p className="font-medium text-sm">
                    {formatPrice(shipment.totalPrice || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-md text-white shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                {getStatusIcon(shipment.status)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Status</p>
                <Badge
                  variant={getStatusBadgeVariant(shipment.status)}
                  className="mt-0.5 text-xs px-2 py-0.5"
                >
                  {getStatusLabel(shipment.status)}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Pengirim</p>
                  <p className="font-medium text-sm truncate">
                    {shipment.senderName || "-"}
                  </p>
                </div>
                <div className="bg-gray-200 p-2 rounded-full shrink-0">
                  <TruckTime size={16} />
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-xs text-gray-500">Penerima</p>
                  <p className="font-medium text-sm truncate">
                    {shipment.recipientName || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500">Alamat Tujuan</p>
                <p className="font-medium text-sm">
                  {shipment.destinationAddress || "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Detail;
