import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/lib/api/types";

interface PaginationControlProps {
  paging: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationControl({ paging, onPageChange }: PaginationControlProps) {
  const { currentPage, totalPages, totalData, currentLimit } = paging;

  const from = totalData === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  const to = Math.min(currentPage * currentLimit, totalData);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-medium">{from}–{to}</span> dari{" "}
        <span className="font-medium">{totalData}</span> data
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
