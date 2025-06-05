import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type UserCol = {
  id: string;
  username: string;
  email: string;
  role: "student" | "psychologist";
  is_verified: boolean;
};

export const columns: ColumnDef<UserCol>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }: { row: Row<UserCol> }) => <div>{row.original.username}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: Row<UserCol> }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: Row<UserCol> }) => (
      <span className="capitalize">{row.original.role}</span>
    ),
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: ({ row }: { row: Row<UserCol> }) => (
      <span className={row.original.is_verified ? "text-green-600" : "text-red-600"}>
        {row.original.is_verified ? "Yes" : "No"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: Row<UserCol> }) => (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          // implement delete logic
          console.log("Deleting user", row.original.id);
        }}
      >
        Delete
      </Button>
    ),
  },
];
