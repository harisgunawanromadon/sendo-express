"use client";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { HistoryActionCell } from "./history-action-cell";
import type { History } from "@/lib/api/types/history";
import type { DeliveryStatus } from "@/lib/api/types/shipment";
import {
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/utils/status-utils";

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: "trackingNumber",
    header: "No Resi",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("trackingNumber")}
      </div>
    ),
  },
  {
    accessorKey: "packageType",
    header: "Jenis Paket",
    cell: ({ row }) => (
      <div className="text-sm capitalize">
        {(row.getValue("packageType") as string)?.toLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      const raw = row.getValue("createdAt") as string | undefined;
      const date = raw ? new Date(raw).toLocaleDateString("id-ID") : "N/A";
      return <div className="text-sm">{date}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as DeliveryStatus;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => <HistoryActionCell history={row.original} />,
  },
];
