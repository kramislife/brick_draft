import React, { useState } from "react";
import { toast } from "sonner";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import AdminDialogLayout from "@/components/admin/shared/AdminDialogLayout";
import PartCategoryForm from "@/components/admin/components/PartCategoryForm";
import {
  useGetPartCategoriesQuery,
  useAddPartCategoryMutation,
  useUpdatePartCategoryMutation,
} from "@/redux/api/admin/partCategoryApi";

const PartCategories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: categories = [], isLoading } = useGetPartCategoriesQuery();
  const [addPartCategory] = useAddPartCategoryMutation();
  const [updatePartCategory] = useUpdatePartCategoryMutation();

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
        // Update existing category
        const result = await updatePartCategory({
          id: formData.id,
          ...formData,
        }).unwrap();
        toast.success(result.message || "Category updated successfully", {
          description:
            result.description || `${formData.name} has been updated.`,
        });
      } else {
        // Add new category
        const result = await addPartCategory(formData).unwrap();
        toast.success(result.message || "Category created successfully", {
          description:
            result.description ||
            `${formData.name} has been added to categories.`,
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
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "parts",
      header: "Parts",
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
        title="Part Categories"
        description="Manage categories for LEGO parts and components."
        onAdd={handleAdd}
        columns={columns}
        data={categories}
        isLoading={isLoading}
      />

      <AdminDialogLayout
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Part Category"
        description="Add a new category for organizing parts."
        onSubmit={handleSubmit}
        isEdit={!!formData.id}
      >
        <PartCategoryForm formData={formData} onChange={handleChange} />
      </AdminDialogLayout>
    </>
  );
};

export default PartCategories;
