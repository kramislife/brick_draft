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
import CollectionForm from "@/components/admin/components/CollectionForm";
import {
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from "@/redux/api/collectionApi";

const Collections = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const { data: collectionsData, isLoading } = useGetCollectionsQuery();
  const collections = collectionsData?.collections || [];
  const [addCollection, { isLoading: isCreating }] = useAddCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();

  const isFormLoading = isCreating || isUpdating;

  const handleAdd = () => {
    setFormData({ name: "", description: "", image: null });
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setFormData({
      id: data._id,
      name: data.name,
      description: data.description,
      image: data.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (data) => {
    setSelectedCollection(data);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCollection({ id: selectedCollection._id }).unwrap();
      toast.success("Collection deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCollection(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete collection");
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
        const result = await updateCollection({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          ...(formData.image && { image: formData.image }),
        }).unwrap();
        toast.success(result.message || "Collection updated successfully", {
          description:
            result.description || `${formData.name} has been updated.`,
        });
      } else {
        const result = await addCollection({
          name: formData.name,
          description: formData.description,
          ...(formData.image && { image: formData.image }),
        }).unwrap();
        toast.success(result.message || "Collection created successfully", {
          description:
            result.description ||
            `${formData.name} has been added to collections.`,
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

  const capitalize = (str) => {
    if (typeof str !== "string" || !str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
      accessorKey: "name",
      header: "Collection",
      cell: ({ row }) => capitalize(row.original.name),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "items",
      header: "Items",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
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
        title="Collections"
        description="Manage LEGO collections for your lottery items."
        onAdd={handleAdd}
        columns={columns}
        data={collections}
        isLoading={isLoading}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Collection"
        description="Add a new collection to organize lottery items."
        onSubmit={handleSubmit}
        isEdit={!!formData.id}
        isLoading={isFormLoading}
      >
        <CollectionForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>

      <DeleteDialogLayout
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedCollection?.name}
        itemType="Collection"
        isLoading={isDeleting}
      />
    </>
  );
};

export default Collections;
