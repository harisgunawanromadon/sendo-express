import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { createColumns } from "./components/datatable/columns";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddSquare } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useUserAddresses } from "@/hooks/use-user-address";
import { useState } from "react";

export default function UserAddressesPage() {
  // Use custom meta hook
  useMeta(META_DATA["user-addresses"]);

  const {
    data: userAddresses = [],
    isLoading: loadingUserAddresses,
    error: errorUserAddresses,
  } = useUserAddresses();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter user addresses based on search term
  const filteredUserAddresses = userAddresses.filter((address) => {
    return (
      address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loadingUserAddresses) {
    return (
      <Page title="Alamat Saya">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data alamat...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (errorUserAddresses) {
    return (
      <Page title="Alamat Saya">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">
              Gagal memuat data alamat: {errorUserAddresses.message}
            </p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page
        title="Alamat Saya"
        action={
          <Link to="/user-addresses/add">
            <Button variant="darkGreen">
              Tambah Alamat Baru
              <AddSquare className="ml-auto" variant="Bold" size="20" />
            </Button>
          </Link>
        }
      >
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Cari Alamat"
            className="w-full max-w-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loadingUserAddresses ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <DataTable
            data={filteredUserAddresses}
            columns={createColumns()}
            title="Daftar Alamat"
          />
        )}
        <Toaster position="top-right" />
      </Page>
    </>
  );
}
