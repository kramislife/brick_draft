import React, { useState } from "react";
import { toast } from "sonner";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import CollectionForm from "@/components/admin/components/CollectionForm";
import {
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
} from "@/redux/api/admin/collectionApi";

const Collections = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: collections = [], isLoading } = useGetCollectionsQuery();
  const [addCollection] = useAddCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();

  const handleAdd = () => {
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (data) => {
    setFormData(data);
    setIsDialogOpen(true);
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
          ...formData,
        }).unwrap();
        toast.success(result.message || "Collection updated successfully", {
          description:
            result.description || `${formData.name} has been updated.`,
        });
      } else {
        const result = await addCollection(formData).unwrap();
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

  const columns = [
    {
      accessorKey: "name",
      header: "Collection",
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
    },
    {
      id: "actions",
      header: "Actions",
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
      >
        <CollectionForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>
    </>
  );
};

export default Collections;
