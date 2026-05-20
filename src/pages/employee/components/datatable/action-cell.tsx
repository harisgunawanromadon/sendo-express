import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PermissionGuard } from "@/components/permission-guard";
import type { EmployeeBranch } from "@/lib/api/types/employee";
import { useDeleteEmployee } from "@/hooks/use-employee";

interface ActionCellProps {
  employee: EmployeeBranch;
}

export function ActionCell({ employee }: ActionCellProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteEmployeeMutation = useDeleteEmployee(employee.id);

  const handleDelete = async () => {
    setIsLoading(true);
    deleteEmployeeMutation.mutate(undefined, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="flex space-x-2">
      <PermissionGuard permission="employee.delete">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="rounded-lg">
              Hapus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Karyawan</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus karyawan{" "}
                <strong>{employee.user.fullName}</strong>? Tindakan ini tidak
                dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteEmployeeMutation.isPending}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {deleteEmployeeMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGuard>
    </div>
  );
}
