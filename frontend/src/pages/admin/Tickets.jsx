import React, { useState } from "react";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import TicketForm from "@/components/admin/components/TicketForm";

const Tickets = () => {
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
      accessorKey: "ticketId",
      header: "Ticket ID",
    },
    {
      accessorKey: "lotterySet",
      header: "Lottery Set",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
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
        title="Tickets"
        description="Manage lottery tickets and purchases."
        onAdd={handleAdd}
        columns={columns}
        data={[]}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Ticket"
        description="Add a new ticket to the system."
        onSubmit={handleSubmit}
        isEdit={!!editData}
      >
        <TicketForm defaultValues={editData} />
      </AdminDialogLayout>
    </>
  );
};

export default Tickets;
