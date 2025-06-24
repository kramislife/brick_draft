import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

const CollectionForm = ({ formData, onChange }) => {
  const [imagePreview, setImagePreview] = useState(formData.image?.url || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for API
      const reader2 = new FileReader();
      reader2.onload = (e) => {
        const base64String = e.target.result;
        onChange({
          target: {
            name: "image",
            value: base64String,
          },
        });
      };
      reader2.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    onChange({
      target: {
        name: "image",
        value: "",
      },
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

      <div className="space-y-2">
        <Label htmlFor="image">Collection Image</Label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Collection preview"
                className="w-full h-48 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed  rounded-md p-5 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
          <Input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
