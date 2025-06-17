import React, { useState } from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import AnnouncementForm from "@/components/admin/components/AnnouncementForm";

const Announcement = () => {
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
    // Handle form submission
    console.log("Form submitted", editData ? "edit" : "add");
    setIsDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "announcement",
      header: "Announcement",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <>
      <ViewLayout
        title="Announcements"
        description="Manage announcements for your lottery platform."
        onAdd={handleAdd}
        columns={columns}
        data={[]}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Announcement"
        description="Add a new announcement to display on the platform."
        onSubmit={handleSubmit}
        isEdit={!!editData}
      >
        <AnnouncementForm defaultValues={editData} />
      </AdminDialogLayout>
    </>
  );
};

export default Announcement;
