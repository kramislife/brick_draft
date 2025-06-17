import React, { useState } from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import PartForm from "@/components/admin/components/PartForm";

const Parts = () => {
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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.name}
          className="h-12 w-12 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "details",
      header: "Part Details",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "color",
      header: "Color",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <>
      <ViewLayout
        title="Parts"
        description="Manage LEGO parts inventory and details."
        onAdd={handleAdd}
        columns={columns}
        data={[]}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="LEGO Part"
        description="Add a new LEGO part to your inventory."
        onSubmit={handleSubmit}
        isEdit={!!editData}
        size="3xl"
      >
        <PartForm defaultValues={editData} />
      </AdminDialogLayout>
    </>
  );
};

export default Parts;
