import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { createColumns } from "./components/datatable/columns";
import { Input } from "@/components/ui/input";
import { useRoles } from "@/hooks/use-role";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RolePage() {
  useMeta(META_DATA.role);
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("name") ?? "");
  const debouncedSearch = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { name: debouncedSearch } : {}, {
      replace: true,
    });
  }, [debouncedSearch, setSearchParams]);

  const {
    data: roles,
    isLoading: isLoadingRoles,
    isFetching: isFetchingRoles,
    error: rolesError,
    refetch,
  } = useRoles(debouncedSearch);

  const columns = createColumns(() => refetch());
  const isLoading = isLoadingRoles || isFetchingRoles;

  if (rolesError) {
    return (
      <Page title="Kelola Role 🔐👨‍💼">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-red-600 text-2xl font-semibold">
            Gagal memuat data role
          </h2>
          <p className="text-gray-600">{rolesError.message}</p>
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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data role...</p>
        </div>
      ) : (
        <>
          <DataTable data={roles ?? []} columns={columns} title="Daftar Role" />
        </>
      )}
    </Page>
  );
}
