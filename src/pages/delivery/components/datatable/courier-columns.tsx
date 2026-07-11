"use client";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import type { CourierShipmentListItem } from "@/lib/api/types/delivery";
import {
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/utils/status-utils";
import ActionButtons from "./action-buttons";

export const courierColumns = (
  onActionComplete: () => void,
): ColumnDef<CourierShipmentListItem>[] => [
  {
    accessorKey: "trackingNumber",
    header: "No Resi",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.getValue("trackingNumber") || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "destinationAddress",
    header: "Alamat Tujuan",
    cell: ({ row }) => {
      return (
        <div className="text-sm max-w-xs truncate">
          {row.original.destinationAddress || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <ActionButtons
          shipment={row.original}
          onActionComplete={onActionComplete}
        />
      );
    },
  },
];
