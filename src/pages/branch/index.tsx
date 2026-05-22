import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useBranches } from "@/hooks/use-branch";
import { DataTable, columns, AddBranchModal } from "./components";
import { PermissionGuard } from "@/components";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const LIMIT = 5;

export default function BranchPage() {
  useMeta(META_DATA.branch);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const nameParam = searchParams.get("name") ?? "";

  const [inputName, setInputName] = useState(nameParam);
  const debouncedName = useDebounce(inputName, 400);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedName) {
          next.set("name", debouncedName);
        } else {
          next.delete("name");
        }
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedName]);

  const {
    data,
    error,
    isLoading: isLoadingBranches,
    isFetching: isFetchingBranches,
  } = useBranches({
    name: debouncedName || undefined,
    page,
    limit: LIMIT,
  });

  const branches = data?.data ?? [];
  const paging = data?.paging;

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(newPage));
        return next;
      },
      { replace: true },
    );
  };

  const isLoading = isLoadingBranches || isFetchingBranches;

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
        onChange={(e) => setInputName(e.target.value)}
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data cabang...</p>
        </div>
      ) : (
        <PermissionGuard permission="branches.read">
          <DataTable data={branches} columns={columns()} title="Semua Cabang" />
          {paging && paging.totalPages > 1 && (
            <PaginationControl
              paging={paging}
              onPageChange={handlePageChange}
            />
          )}
        </PermissionGuard>
      )}
    </Page>
  );
}
