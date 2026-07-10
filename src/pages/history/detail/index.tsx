import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page, type PageBreadcrumbItem } from "@/components/ui/page";
import {
  Box,
  CallIncoming,
  CallOutgoing,
  CardPos,
  CloseCircle,
  Gps,
  I3DCubeScan,
  Location,
  Profile2User,
  Timer,
  TruckTime,
  User,
} from "iconsax-reactjs";
import { Slash } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useHistoryById } from "@/hooks/use-history";
import {
  getStatusBadgeVariant,
  getStatusLabel,
  getStatusIcon,
} from "@/lib/utils/status-utils";

const DetailHistoryPage = () => {
  useMeta(META_DATA["history-detail"]);
  const { id } = useParams();
  const navigate = useNavigate();

  const isValidId = !!id && !isNaN(parseInt(id));
  const historyId = isValidId ? parseInt(id!) : 0;

  const { data, isLoading, isError, error } = useHistoryById(historyId);
  const shipment = data?.data ?? null;

  useEffect(() => {
    if (!isValidId) {
      navigate("/history", { replace: true });
    }
  }, [isValidId, navigate]);

  const breadcrumbs: PageBreadcrumbItem[] = [
    { label: "Riwayat Pengiriman", href: "/history" },
    { label: "Detail Pengiriman", href: `/history/detail/${id}` },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isValidId) {
    return null;
  }

  if (isLoading) {
    return (
      <Page title="Detail Pengiriman">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-secondary">Memuat detail pengiriman...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (isError || !shipment) {
    const errorMessage =
      error?.message || "Data pengiriman yang Anda cari tidak dapat ditemukan.";

    return (
      <Page title="Detail Pengiriman">
        <div className="text-center py-8">
          <CloseCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">
            Pengiriman Tidak Ditemukan
          </h3>
          <p className="text-secondary mb-4">{errorMessage}</p>
          <Button onClick={() => navigate("/history")} variant="darkGreen">
            Kembali ke Riwayat
          </Button>
        </div>
      </Page>
    );
  }

  const info = shipment.shipmentInfo;

  return (
    <Page
      title={`Detail Pengiriman - ${shipment.trackingNumber ?? "N/A"}`}
      breadcrumbs={{ items: breadcrumbs, separator: <Slash size={16} /> }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          {/* Alamat Pengiriman */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pengirim */}
              <div className="flex items-start gap-3">
                <div className="bg-primary p-4 rounded-2xl text-white">
                  <Gps size={20} variant="Bold" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold">
                    {info?.senderAddress ?? "Alamat tidak tersedia"}
                  </h2>
                  <p className="text-sm text-secondary">Alamat Pengirim</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} />
                    <span>{info?.senderName ?? "Tidak tersedia"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CallOutgoing size={16} />
                    <span>{info?.senderPhone ?? "Tidak tersedia"}</span>
                  </div>
                </div>
              </div>
              {/* Penerima */}
              <div className="flex items-start gap-3">
                <div className="bg-oranye p-4 rounded-2xl text-white">
                  <Location size={20} variant="Bold" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold">
                    {info?.recipientAddress ?? "Alamat tidak tersedia"}
                  </h2>
                  <p className="text-sm text-secondary">Alamat Penerima</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Profile2User size={16} />
                    <span>{info?.recipientName ?? "Tidak tersedia"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CallIncoming size={16} />
                    <span>{info?.recipientPhone ?? "Tidak tersedia"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Info Pengiriman */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Info Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-dark-green p-3 rounded-xl text-white">
                    <TruckTime size={16} variant="Bold" />
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary">Jenis Pengiriman</h3>
                    <p className="font-semibold capitalize">
                      {shipment.deliveryType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-3 rounded-xl text-white">
                    <Box size={16} variant="Bold" />
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary">No. Resi</h3>
                    <p className="font-semibold">
                      {shipment.trackingNumber ?? "Tidak tersedia"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-oranye p-3 rounded-xl text-white">
                    <I3DCubeScan size={16} variant="Bold" />
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary">Jenis Paket</h3>
                    <p className="font-semibold capitalize">
                      {shipment.packageType?.toLowerCase() ?? "Tidak tersedia"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-dark-green p-3 rounded-xl text-white">
                    <CardPos size={16} variant="Bold" />
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary">Status</h3>
                    <Badge variant={getStatusBadgeVariant(shipment.status)}>
                      {getStatusLabel(shipment.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Riwayat Status */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Riwayat Status Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {shipment.shipmentHistories &&
              shipment.shipmentHistories.length > 0 ? (
                [...shipment.shipmentHistories]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((history, index, arr) => (
                    <div key={history.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-3 rounded-full text-white ${
                            index === 0 ? "bg-primary" : "bg-dark-green"
                          }`}
                        >
                          {getStatusIcon(history.status)}
                        </div>
                        {index < arr.length - 1 && (
                          <div className="w-px h-8 bg-gray-300 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium">
                          {getStatusLabel(history.status)}
                        </p>
                        <p className="text-sm text-secondary mb-1">
                          {formatDate(history.createdAt)}
                        </p>
                        {history.description && (
                          <p className="text-sm text-gray-600">
                            {history.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <Timer size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-secondary">Belum ada riwayat status</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default DetailHistoryPage;
