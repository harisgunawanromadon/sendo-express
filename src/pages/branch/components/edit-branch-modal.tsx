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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { branchSchema, type BranchFormData } from "@/lib/validations/branch";
import { useUpdateBranch } from "@/hooks/use-branch";
import type { Branch } from "@/lib/api/types/branch";

interface EditBranchModalProps {
  branch: Branch;
  onBranchUpdated?: () => void;
}

export function EditBranchModal({
  branch,
  onBranchUpdated,
}: EditBranchModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const updateBranchMutation = useUpdateBranch();

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branch.name,
      address: branch.address,
      phoneNumber: branch.phoneNumber,
    },
  });


  async function onSubmit(values: BranchFormData) {
    try {
      setIsLoading(true);
      await updateBranchMutation.mutateAsync({
        id: branch.id,
        data: values,
      });
      setIsOpen(false);
      onBranchUpdated?.();
    } catch (error) {
      console.error("Error updating branch:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
    form.reset({
      name: branch.name,
      address: branch.address,
      phoneNumber: branch.phoneNumber,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="darkGreen" size="sm" className="rounded-lg">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Cabang</DialogTitle>
          <DialogDescription>
            Perbarui informasi cabang yang dipilih
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Cabang</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan nama cabang" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan alamat cabang" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan nomor telepon" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="darkGreen"
                disabled={updateBranchMutation.isPending}
              >
                {updateBranchMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
