// app/admin/users/page.tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function AdminUserPage() {
  const [userData, setUserData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(async () => {
    try {
      setError(null);
      const res = await axios.get("http://localhost:8000/api/v1/users-all/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setUserData(res.data);
    } catch (err: any) {
      setError("Gagal mengambil data pengguna.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const columns = [
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "is_verified", label: "Terverifikasi" },
];


  return (
    <div className="mx-3">
      <h2 className="text-2xl font-semibold text-primary mb-3">Daftar Pengguna</h2>
      <DataTable columns={columns} data={userData}/>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
