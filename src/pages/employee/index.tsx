import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { columns } from "./components/datatable/columns";
import { AddEmployeeModal } from "./components/add-employee-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useEmployees } from "@/hooks/use-employee";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { EmployeeBranchFilters } from "@/lib/api/types/employee";
import { Loader2 } from "lucide-react";

const DEFAULT_LIMIT = 5;

type FilterField = "name" | "email" | "phoneNumber" | "branchName";

const FILTER_OPTIONS: { value: FilterField; label: string }[] = [
  { value: "name", label: "Nama" },
  { value: "email", label: "Email" },
  { value: "phoneNumber", label: "No. Telepon" },
  { value: "branchName", label: "Cabang" },
];

export default function EmployeePage() {
  useMeta(META_DATA.employee);
  const [searchParams, setSearchParams] = useSearchParams();

  const detectFilterField = (): FilterField => {
    const found = FILTER_OPTIONS.find((opt) => searchParams.has(opt.value));
    return found?.value ?? "name";
  };

  const [filterField, setFilterField] =
    useState<FilterField>(detectFilterField());
  const [inputValue, setInputValue] = useState(
    searchParams.get(filterField) ?? "",
  );

  const debouncedSearch = useDebounce(inputValue, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentLimit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);
    const params: Record<string, string> = {
      page: "1",
      limit: currentLimit,
    };
    if (debouncedSearch) {
      params[filterField] = debouncedSearch;
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filterField]);

  const handleFilterFieldChange = (value: FilterField) => {
    setFilterField(value);
    setInputValue("");
  };

  const currentPage = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  const handlePageChange = (page: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        return next;
      },
      { replace: true },
    );
  };

  const filters: EmployeeBranchFilters = {
    [filterField]: debouncedSearch || undefined,
    page: currentPage,
    limit,
  };

  const {
    data,
    error: employeeError,
    isLoading: isLoadingEmployees,
  } = useEmployees(filters);

  const paging = data?.paging;

  if (employeeError) {
    return (
      <Page title="Kelola Karyawan 👥💼">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-red-600 text-2xl font-semibold">
            Gagal memuat data karyawan
          </h2>
          <p className="text-gray-600">{employeeError.message}</p>
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

  const activePlaceholder =
    FILTER_OPTIONS.find((o) => o.value === filterField)?.label ?? "Nama";

  return (
    <Page title="Kelola Karyawan 👥💼" action={<AddEmployeeModal />}>
      <div className="flex gap-2 mb-4 w-full max-w-md">
        <Select value={filterField} onValueChange={handleFilterFieldChange}>
          <SelectTrigger className="w-40 bg-white shrink-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder={`Cari berdasarkan ${activePlaceholder}`}
          className="bg-white flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      {isLoadingEmployees ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data karyawan...</p>
        </div>
      ) : (
        <>
          <DataTable
            data={data?.data ?? []}
            columns={columns()}
            title="Daftar Karyawan"
          />
          {paging && paging.totalPages > 1 && (
            <PaginationControl
              paging={paging}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Page>
  );
}
