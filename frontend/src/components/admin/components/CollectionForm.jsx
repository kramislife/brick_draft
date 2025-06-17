import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CollectionForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Collection Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          placeholder="e.g., Harry Potter, Marvel, Disney"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onChange}
          placeholder="Enter a description for this collection"
        />
      </div>
    </div>
  );
};

export default CollectionForm;
