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
import ColorForm from "@/components/admin/components/ColorForm";
import {
  useGetColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "@/redux/api/admin/colorApi";

const Colors = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [formData, setFormData] = useState({
    color_name: "",
    hex_code: "",
  });

  const { data: colorsData, isLoading } = useGetColorsQuery();
  const colors = colorsData?.colors || [];
  const [addColor, { isLoading: isCreating }] = useAddColorMutation();
  const [updateColor, { isLoading: isUpdating }] = useUpdateColorMutation();
  const [deleteColor, { isLoading: isDeleting }] = useDeleteColorMutation();

  const isFormLoading = isCreating || isUpdating;

  const handleAdd = () => {
    setFormData({ color_name: "", hex_code: "#000000" });
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setFormData({
      id: data._id,
      color_name: data.color_name,
      hex_code: data.hex_code,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (data) => {
    setSelectedColor(data);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteColor({ id: selectedColor._id }).unwrap();
      toast.success("Color deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedColor(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete color");
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
        await updateColor(formData).unwrap();
        toast.success("Color updated successfully");
      } else {
        await addColor(formData).unwrap();
        toast.success("Color created successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Operation failed");
    }
  };

  const columns = [
    {
      accessorKey: "color_name",
      header: "Color Name",
    },
    {
      accessorKey: "hex_code",
      header: "Hex Code",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.hex_code }}
          />
          <span>{row.original.hex_code.toUpperCase()}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
        title="Colors"
        description="Manage the colors for LEGO parts and other items."
        onAdd={handleAdd}
        columns={columns}
        data={colors}
        isLoading={isLoading}
      />
      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Color"
        description="Add or edit color details."
        onSubmit={handleSubmit}
        isEdit={!!formData.id}
        isLoading={isFormLoading}
      >
        <ColorForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>
      
      <DeleteDialogLayout
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedColor?.color_name}
        itemType="Color"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Colors;
