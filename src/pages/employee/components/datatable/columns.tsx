"use client";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { EmployeeBranch } from "@/lib/api/types/employee";
import { ActionCell } from "./action-cell";

export const columns = (): ColumnDef<EmployeeBranch>[] => [
  {
    id: "number",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const isAsc = isSorted === "asc";
      const isDesc = isSorted === "desc";

      const handleSort = () => {
        if (!isSorted) {
          column.toggleSorting(false);
        } else if (isAsc) {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      };

      return (
        <div className="flex items-center justify-between">
          <span>No</span>
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-2"
          >
            <ArrowUpDown
              className="h-4 w-4"
              color={isAsc ? "#4CAF50" : isDesc ? "#F44336" : "#000"}
            />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-sm font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "user.fullName",
    header: "Nama Karyawan",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.original.user.fullName}</div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.user.email}</div>;
    },
  },
  {
    accessorKey: "user.phoneNumber",
    header: "Nomor Telepon",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.user.phoneNumber}</div>;
    },
  },
  {
    accessorKey: "user.role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user.role;
      const roleLabel = role === "courier" ? "Kurir" : "Admin";
      const roleColor =
        role === "courier"
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800";

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor}`}
        >
          {roleLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "branch.name",
    header: "Cabang",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.branch.name}</div>;
    },
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => {
      return <ActionCell employee={row.original} />;
    },
  },
];
