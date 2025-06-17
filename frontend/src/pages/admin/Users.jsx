import React from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";

const Users = () => {
  const columns = [
    {
      accessorKey: "user",
      header: "User",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
    },
    {
      accessorKey: "tickets",
      header: "Tickets",
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <ViewLayout
      title="Users"
      description="Manage user accounts and permissions."
      columns={columns}
      data={[]}
    />
  );
};

export default Users;
