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
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-base">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.pieces} pieces
          </div>
        </div>
      ),
    },
    {
      accessorKey: "collection",
      header: "Collection",
      cell: ({ row }) => row.original.collection?.name || "-",
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">
            ${Number(row.original.ticketPrice).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            Market: ${Number(row.original.marketPrice).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      id: "drawDate",
      header: "Draw Date",
      cell: ({ row }) => {
        const date = row.original.drawDate
          ? new Date(row.original.drawDate)
          : null;
        const time = row.original.drawTime || "";
        let formattedDate = "-";
        let formattedTime = "";
        if (date) {
          formattedDate = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        if (time) {
          // Format time as h:mm AM/PM
          const [h, m] = time.split(":");
          const d = new Date();
          d.setHours(h, m);
          formattedTime =
            d.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            }) + " EST";
        }
        return (
          <div>
            <div className="font-semibold">{formattedDate}</div>
            <div className="text-xs text-muted-foreground">{formattedTime}</div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        // For now, always show Active. You can update this logic if you have status in data.
        const status = row.original.lottery_status || "Active";
        const totalSlots = row.original.totalSlots || 0;
        // You may want to use a real slotsLeft value if available
        // For now, just show all slots left as in the image
        const slotsLeft = row.original.slotsLeft || totalSlots; // fallback
        return (
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <div className="text-xs text-muted-foreground">
              {slotsLeft} of {totalSlots} slots left
            </div>
          </div>
        );
      },
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
