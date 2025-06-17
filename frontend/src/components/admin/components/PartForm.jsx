import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Box, Palette, Scale, UploadCloud } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PartForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    partId: "",
    weight: "",
    category: "",
    partType: "",
    color: "",
    price: "",
    quantity: "",
    image: null,
    imagePreview: null,
  });

  // Calculate total value
  const totalValue = (
    Number(formData.price) * Number(formData.quantity)
  ).toFixed(2);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Part Details */}
      <div className="space-y-2">
        <Label htmlFor="name">Part Name</Label>
        <Input
          id="name"
          placeholder="e.g., Tile 2x2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partId">Part ID</Label>
          <Input
            id="partId"
            placeholder="e.g., 36840"
            value={formData.partId}
            onChange={(e) =>
              setFormData({ ...formData, partId: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            type="number"
            id="weight"
            placeholder="e.g., 0.5g"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiles">Tiles</SelectItem>
              <SelectItem value="bricks">Bricks</SelectItem>
              <SelectItem value="plates">Plates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 0.89"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partType">Part Type</Label>
          <Input
            id="partType"
            placeholder="e.g., Smooth Plates"
            value={formData.partType}
            onChange={(e) =>
              setFormData({ ...formData, partType: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            placeholder="e.g., 100"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="e.g., Light Yellow"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Total Value ($)</Label>
          <Input value={totalValue} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">
            Automatically calculated (Price × Quantity)
          </p>
        </div>
      </div>

      {/* Part Image Upload */}
      <div className="space-y-2">
        <Label>Part Image</Label>
        <div className="border-2 border-dashed rounded-lg p-6">
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload an image
              </span>
              <span className="text-xs text-muted-foreground">
                or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB
              </span>
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 bg-muted rounded flex items-center justify-center overflow-hidden">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Box className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <p className="font-semibold text-base">
                Part ID: {formData.partId || "ID"} •{" "}
                {formData.name || "Part Name"}
              </p>
              <p>
                Quantity:{" "}
                <span className="font-medium">{formData.quantity || "0"}</span>{" "}
                Total Value:{" "}
                <span className="font-bold text-emerald-500">
                  ${totalValue}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Palette className="w-4 h-4" />
                  <span>{formData.color || "Color"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Box className="w-4 h-4" />
                  <span>{formData.partType || "Part Type"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scale className="w-4 h-4" />
                  <span>{formData.weight || "Weight"}g</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-2">
          This is how the part will appear in the lottery details.
        </p>
      </div>
    </div>
  );
};

export default PartForm;
