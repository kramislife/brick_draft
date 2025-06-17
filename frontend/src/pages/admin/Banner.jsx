import React, { useState } from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import BannerForm from "@/components/admin/components/BannerForm";

const Banner = () => {
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
      accessorKey: "preview",
      header: "Preview",
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.title}
          className="h-12 w-20 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "badge",
      header: "Badge",
    },
    {
      accessorKey: "created",
      header: "Created",
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <>
      <ViewLayout
        title="Banners"
        description="Manage banner images and content for your platform."
        onAdd={handleAdd}
        columns={columns}
        data={[]}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Banner"
        description="Add a new banner to display on the platform."
        onSubmit={handleSubmit}
        isEdit={!!editData}
      >
        <BannerForm defaultValues={editData} />
      </AdminDialogLayout>
    </>
  );
};

export default Banner;
