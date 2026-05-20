import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { createColumns } from "./components/datatable/columns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRoles } from "@/hooks/use-role";
import { Skeleton, PermissionGuard } from "@/components";
import { useMeta, META_DATA } from "@/hooks/use-meta";

export default function RolePage() {
  // Use custom meta hook
  useMeta(META_DATA.role);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: roles, isLoading: isLoadingRoles, error: rolesError, refetch } = useRoles();

  const filteredRoles =
    roles?.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.permissions.some(
          (permission) =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.key.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    ) || [];

  const columns = createColumns(() => refetch());

  if (isLoadingRoles) {
    return (
      <Page title="Kelola Role 🔐👨‍💼">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data role...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (rolesError) {
    return (
      <Page title="Kelola Role 🔐👨‍💼">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-red-600 text-2xl font-semibold mb-4">
              Gagal memuat data role
            </h2>
            <p className="text-gray-600">{rolesError.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Muat Ulang
          </button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Kelola Role 🔐👨‍💼">
      <Input
        type="text"
        placeholder="Cari Role Berdasarkan Nama Role"
        className="mb-4 w-full max-w-md bg-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoadingRoles ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : (
        <PermissionGuard
          permission="permissions.read"
          fallback={
            <div className="rounded-2xl bg-white p-6 text-sm text-gray-600">
              Anda tidak memiliki izin untuk melihat daftar role.
            </div>
          }
        >
          <DataTable
            data={filteredRoles}
            columns={columns}
            title="Daftar Role"
          />
        </PermissionGuard>
      )}
    </Page>
  );
}
