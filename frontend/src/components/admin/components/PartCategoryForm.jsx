import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PartCategoryForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          placeholder="e.g., Bricks, Plates, Tiles"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onChange}
          placeholder="Enter a description for this category"
        />
      </div>
    </div>
  );
};

export default PartCategoryForm;
