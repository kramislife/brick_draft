import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetColorsQuery } from "@/redux/api/colorApi";

const PartForm = ({ formData, onChange }) => {
  const [imagePreview, setImagePreview] = useState(
    formData.image?.url || formData.image || ""
  );
  const fileInputRef = useRef(null);

  const { data: colorsData, isLoading: isLoadingColors } = useGetColorsQuery();
  const colors = colorsData?.colors || [];

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
      {/* Part Details */}
      <div className="space-y-2">
        <Label htmlFor="name">Part Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Tile 2x2"
          value={formData.name || ""}
          onChange={onChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="part_id">Part ID</Label>
          <Input
            id="part_id"
            name="part_id"
            placeholder="e.g., 3001"
            value={formData.part_id || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item_id">Item ID</Label>
          <Input
            id="item_id"
            name="item_id"
            placeholder="e.g., 3684012"
            value={formData.item_id || ""}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) =>
              onChange({
                target: {
                  name: "category",
                  value: value,
                },
              })
            }
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="part">Part</SelectItem>
              <SelectItem value="minifigure">Minifigure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_name">Category Name</Label>
          <Input
            id="category_name"
            name="category_name"
            placeholder="e.g., Smooth Plates, Frames, Tiles"
            value={formData.category_name || ""}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (g)</Label>
          <Input
            type="number"
            id="weight"
            name="weight"
            min="0"
            step="0.01"
            placeholder="e.g., 0.5"
            value={formData.weight || ""}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select
            value={formData.color || ""}
            onValueChange={(value) =>
              onChange({
                target: {
                  name: "color",
                  value: value,
                },
              })
            }
          >
            <SelectTrigger id="color" className="w-full">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingColors ? (
                <SelectItem value="loading" disabled>
                  Loading colors...
                </SelectItem>
              ) : (
                colors.map((color) => (
                  <SelectItem key={color._id} value={color._id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      {color.color_name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Part Image Upload */}
      <div className="space-y-2">
        <Label>Part Image</Label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Part preview"
                className="w-full h-32 object-contain rounded-md border"
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
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
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

export default PartForm;
