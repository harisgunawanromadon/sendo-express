import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useBranches } from "@/hooks/use-branch";
import { DataTable, columns, AddBranchModal } from "./components";
import { PermissionGuard } from "@/components";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useState } from "react";

const LIMIT = 5;

export default function BranchPage() {
  useMeta(META_DATA.branch);

  const [searchParams, setSearchParams] = useSearchParams();

  // Baca state dari URL params
  const page = Number(searchParams.get("page") ?? 1);
  const nameParam = searchParams.get("name") ?? "";

  // Controlled input state (debounced sebelum masuk URL)
  const [inputName, setInputName] = useState(nameParam);
  const debouncedName = useDebounce(inputName, 400);

  const {
    data,
    error,
    isLoading: isLoadingBranches,
  } = useBranches({
    name: debouncedName || undefined,
    page,
    limit: LIMIT,
  });

  const branches = data?.data ?? [];
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

  if (isLoadingBranches && !data) {
    return (
      <Page title="Daftar Cabang 🏢">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data cabang...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Daftar Cabang 🏢">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-red-600 text-2xl font-semibold mb-4">
              Gagal memuat data cabang
            </h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Daftar Cabang 🏢"
      action={
        <PermissionGuard permission="branches.create">
          <AddBranchModal />
        </PermissionGuard>
      }
    >
      <Input
        type="text"
        placeholder="Cari Cabang berdasarkan Nama"
        className="mb-4 w-full max-w-sm bg-white"
        value={inputName}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <PermissionGuard
        permission="branches.read"
        fallback={
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-600">
            Anda tidak memiliki izin untuk melihat data cabang.
          </div>
        }
      >
        <DataTable
          data={branches}
          columns={columns()}
          title="Semua Cabang"
        />
        {paging && paging.totalPages > 1 && (
          <PaginationControl paging={paging} onPageChange={handlePageChange} />
        )}
      </PermissionGuard>
    </Page>
  );
}
