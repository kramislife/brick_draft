import React, { useState } from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import LotteryForm from "@/components/admin/components/LotteryForm";

const Lottery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", editData ? "edit" : "add");
    setIsDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "set",
      header: "Set",
    },
    {
      accessorKey: "collection",
      header: "Collection",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "drawDate",
      header: "Draw Date",
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
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <>
      <ViewLayout
        title="Lottery Set"
        description="Manage lottery sets for your platform."
        onAdd={handleAdd}
        columns={columns}
        data={[]}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Lottery Set"
        description="Fill in the details below to create a new lottery set."
        onSubmit={handleSubmit}
        isEdit={!!editData}
        size="5xl"
      >
        <LotteryForm defaultValues={editData} />
      </AdminDialogLayout>
    </>
  );
};

export default Lottery;
