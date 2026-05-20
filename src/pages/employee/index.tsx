import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { columns } from "./components/datatable/columns";
import { AddEmployeeModal } from "./components/add-employee-modal";
import { Input } from "@/components/ui/input";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useEmployees } from "@/hooks/use-employee";
import { PermissionGuard } from "@/components";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useState } from "react";

const LIMIT = 5;

export default function EmployeePage() {
  useMeta(META_DATA.employee);

  const [searchParams, setSearchParams] = useSearchParams();

  // Baca state dari URL params
  const page = Number(searchParams.get("page") ?? 1);
  const nameParam = searchParams.get("name") ?? "";

  // Controlled input state (debounced sebelum masuk URL)
  const [inputName, setInputName] = useState(nameParam);
  const debouncedName = useDebounce(inputName, 400);

  const {
    data,
    error: employeeError,
    isLoading: isLoadingEmployees,
  } = useEmployees({
    name: debouncedName || undefined,
    page,
    limit: LIMIT,
  });

  const employees = data?.data ?? [];
  const paging = data?.paging;

  const handleSearch = (value: string) => {
    setInputName(value);
    // Update URL params: reset page ke 1, update name
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("name", value);
      } else {
        next.delete("name");
      }
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  if (isLoadingEmployees && !data) {
    return (
      <Page title="Kelola Karyawan 👥💼">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data karyawan...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (employeeError) {
    return (
      <Page title="Kelola Karyawan 👥💼">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-red-600 text-2xl font-semibold mb-4">
              Gagal memuat data karyawan
            </h2>
            <p className="text-gray-600">{employeeError.message}</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page
        title="Kelola Karyawan 👥💼"
        action={<AddEmployeeModal />}
      >
        <Input
          type="text"
          placeholder="Cari Karyawan berdasarkan Nama"
          className="mb-4 w-full max-w-md bg-white"
          value={inputName}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <PermissionGuard
          permission="employee.read"
          fallback={
            <div className="rounded-2xl bg-white p-6 text-sm text-gray-600">
              Anda tidak memiliki izin untuk melihat data karyawan.
            </div>
          }
        >
          <DataTable
            data={employees}
            columns={columns()}
            title="Daftar Karyawan"
          />
          {paging && paging.totalPages > 1 && (
            <PaginationControl paging={paging} onPageChange={handlePageChange} />
          )}
        </PermissionGuard>
      </Page>
    </>
  );
}
