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
import PartForm from "@/components/admin/components/PartForm";
import {
  useGetPartsQuery,
  useAddPartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} from "@/redux/api/admin/partItemApi";

const Parts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    part_id: "",
    item_id: "",
    category: "",
    category_name: "",
    weight: "",
    price: "",
    quantity: "",
    color: "",
    image: null,
  });

  const { data: partsData, isLoading } = useGetPartsQuery();
  const parts = partsData?.parts || [];
  const [addPart, { isLoading: isCreating }] = useAddPartMutation();
  const [updatePart, { isLoading: isUpdating }] = useUpdatePartMutation();
  const [deletePart, { isLoading: isDeleting }] = useDeletePartMutation();

  const isFormLoading = isCreating || isUpdating;

  const handleAdd = () => {
    setFormData({
      name: "",
      part_id: "",
      item_id: "",
      category: "",
      category_name: "",
      weight: "",
      price: "",
      quantity: "",
      color: "",
      image: null,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setFormData({
      id: data._id,
      name: data.name,
      part_id: data.part_id,
      item_id: data.item_id,
      category: data.category,
      category_name: data.category_name,
      weight: data.weight,
      price: data.price,
      quantity: data.quantity,
      color: data.color._id || data.color,
      image: data.item_images?.[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (data) => {
    setSelectedPart(data);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePart({ id: selectedPart._id }).unwrap();
      toast.success("Part deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedPart(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete part");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);

      if (formData.id) {
        const result = await updatePart({
          id: formData.id,
          name: formData.name,
          part_id: formData.part_id,
          item_id: formData.item_id,
          category: formData.category,
          category_name: formData.category_name,
          weight: formData.weight,
          price: formData.price,
          quantity: formData.quantity,
          color: formData.color,
          ...(formData.image && { image: formData.image }),
        }).unwrap();
        toast.success(result.message || "Part updated successfully", {
          description:
            result.description || `${formData.name} has been updated.`,
        });
      } else {
        const result = await addPart({
          name: formData.name,
          part_id: formData.part_id,
          item_id: formData.item_id,
          category: formData.category,
          category_name: formData.category_name,
          weight: formData.weight,
          price: formData.price,
          quantity: formData.quantity,
          color: formData.color,
          ...(formData.image && { image: formData.image }),
        }).unwrap();
        toast.success(result.message || "Part created successfully", {
          description:
            result.description || `${formData.name} has been added to parts.`,
        });
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
      accessorKey: "item_images",
      header: "Image",
      cell: ({ row }) => {
        const image = row.original.item_images?.[0];
        return image?.url ? (
          <img
            src={image.url}
            alt={row.original.name}
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
      accessorKey: "part_id",
      header: "Part ID",
    },
    {
      accessorKey: "item_id",
      header: "Item ID",
    },
    {
      accessorKey: "name",
      header: "Part Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.original.color;
        return color ? (
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: color.hex_code }}
            />
            <span>{color.color_name}</span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => `${row.original.weight} g`,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${Number(row.original.price).toFixed(2)}`,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "total_value",
      header: "Total Value",
      cell: ({ row }) => `$${Number(row.original.total_value).toFixed(2)}`,
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
        title="Parts"
        description="Manage LEGO parts inventory and details."
        onAdd={handleAdd}
        columns={columns}
        data={parts}
        isLoading={isLoading}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="LEGO Part"
        description="Add a new LEGO part to your inventory."
        onSubmit={handleSubmit}
        isEdit={!!formData.id}
        isLoading={isFormLoading}
        size="3xl"
      >
        <PartForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>

      <DeleteDialogLayout
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedPart?.name}
        itemType="Part"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Parts;
