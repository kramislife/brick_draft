import React, { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import DeleteDialogLayout from "@/components/admin/shared/DeleteDialogLayout";
import LotteryForm from "@/components/admin/components/LotteryForm";
import {
  useGetLotteriesQuery,
  useAddLotteryMutation,
  useUpdateLotteryMutation,
  useDeleteLotteryMutation,
} from "@/redux/api/admin/lotteryApi";

const Lottery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLottery, setSelectedLottery] = useState(null);
  const [formData, setFormData] = useState({});

  const { data: lotteriesData, isLoading } = useGetLotteriesQuery();
  const lotteries = lotteriesData?.lotteries || [];
  const [addLottery, { isLoading: isCreating }] = useAddLotteryMutation();
  const [updateLottery, { isLoading: isUpdating }] = useUpdateLotteryMutation();
  const [deleteLottery, { isLoading: isDeleting }] = useDeleteLotteryMutation();

  const isFormLoading = isCreating || isUpdating;

  const handleAdd = () => {
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setFormData({
      ...data,
      id: data._id,
      drawDate: data.drawDate || "",
      drawTime: data.drawTime || "",
      collection:
        typeof data.collection === "object"
          ? data.collection._id
          : data.collection,
      parts: Array.isArray(data.parts)
        ? data.parts.map((p) => (typeof p === "object" ? p._id : p))
        : [],
      image: data.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (data) => {
    setSelectedLottery(data);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLottery({ id: selectedLottery._id }).unwrap();
      toast.success("Lottery deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedLottery(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete lottery");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const result = await updateLottery({
          id: formData.id,
          ...formData,
        }).unwrap();
        toast.success(result.message || "Lottery updated successfully");
      } else {
        const result = await addLottery({
          ...formData,
        }).unwrap();
        toast.success(result.message || "Lottery created successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Operation failed", {
        description:
          error.data?.description || "Something went wrong. Please try again.",
      });
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.original.image;
        return image?.url ? (
          <img
            src={image.url}
            alt={row.original.title}
            className="w-12 h-12 object-cover rounded-md mx-auto"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Set Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "collection",
      header: "Collection",
      cell: ({ row }) => row.original.collection?.name || "-",
    },
    {
      accessorKey: "ticketPrice",
      header: "Ticket Price",
      cell: ({ row }) => `$${Number(row.original.ticketPrice).toFixed(2)}`,
    },
    {
      accessorKey: "drawDate",
      header: "Draw Date",
      cell: ({ row }) =>
        row.original.drawDate
          ? new Date(row.original.drawDate).toLocaleDateString()
          : "-",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <ViewLayout
        title="Lotteries"
        description="Manage lottery sets for your platform."
        onAdd={handleAdd}
        columns={columns}
        data={lotteries}
        isLoading={isLoading}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Lottery Set"
        description="Fill in the details below to create a new lottery set."
        onSubmit={handleSubmit}
        isEdit={!!formData.id}
        isLoading={isFormLoading}
        size="5xl"
      >
        <LotteryForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>

      <DeleteDialogLayout
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedLottery?.title}
        itemType="Lottery"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Lottery;
