import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Box,
  AlarmClockCheck,
  Users,
  UploadCloud,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useGetCollectionsQuery } from "@/redux/api/admin/collectionApi";
import { useGetPartsQuery } from "@/redux/api/admin/partItemApi";
import { format } from "date-fns";

const TAG_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best_seller", label: "Best Seller" },
  { value: "new_arrival", label: "New Arrival" },
  { value: "limited_edition", label: "Limited Edition" },
];

const LotteryForm = ({ formData, onChange }) => {
  const [imagePreview, setImagePreview] = useState(formData.image?.url || "");
  const fileInputRef = useRef(null);
  const { data: collectionsData } = useGetCollectionsQuery();
  const { data: partsData } = useGetPartsQuery();
  const collections = collectionsData?.collections || [];
  const parts = partsData?.parts || [];

  // Ensure parts is always an array
  const selectedParts = Array.isArray(formData.parts) ? formData.parts : [];

  useEffect(() => {
    if (!formData.image) {
      setImagePreview("");
    } else if (typeof formData.image === "string") {
      setImagePreview(formData.image);
    } else if (formData.image.url) {
      setImagePreview(formData.image.url);
    }
  }, [formData.image]);

  // Helper to format draw date and time
  const getFormattedDrawDateTime = () => {
    if (!formData.drawDate || !formData.drawTime) return "Draw Date";
    try {
      const date = new Date(`${formData.drawDate}T${formData.drawTime}`);
      return format(date, "MMMM d, yyyy 'at' h:mm a") + " EST";
    } catch {
      return "Draw Date";
    }
  };

  // Image upload logic (base64, like CollectionForm)
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

  // Why Collect logic
  const handleWhyCollectChange = (index, value) => {
    const newWhy = [...(formData.whyCollect || [])];
    newWhy[index] = value;
    onChange({
      target: {
        name: "whyCollect",
        value: newWhy,
      },
    });
  };
  const addWhyCollectPoint = () => {
    if ((formData.whyCollect || []).length < 3) {
      onChange({
        target: {
          name: "whyCollect",
          value: [...(formData.whyCollect || []), ""],
        },
      });
    }
  };
  const removeWhyCollectPoint = (index) => {
    const newWhy = [...(formData.whyCollect || [])];
    newWhy.splice(index, 1);
    onChange({
      target: {
        name: "whyCollect",
        value: newWhy,
      },
    });
  };

  // Parts multi-select logic
  const handleAddPart = (partId) => {
    if (!selectedParts.includes(partId)) {
      onChange({
        target: {
          name: "parts",
          value: [...selectedParts, partId],
        },
      });
    }
  };
  const handleRemovePart = (partId) => {
    onChange({
      target: {
        name: "parts",
        value: selectedParts.filter((id) => id !== partId),
      },
    });
  };

  // Helper for part display
  const getPartDisplay = (part) => (
    <span className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <img
          src={
            part.item_images?.[0]?.url ||
            part.item_images?.[0] ||
            part.image ||
            "/placeholder-part.jpg"
          }
          alt={part.name}
          className="w-6 h-6 object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-part.jpg";
          }}
        />
      </div>
      <span className="font-medium">
        {part.name}{" "}
        <span className="text-muted-foreground text-xs font-light">
          • {part.color?.color_name}
        </span>
      </span>
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Form Column */}
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="title">Set Name</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={onChange}
            placeholder="e.g., Hogwarts Castle"
          />
        </div>
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={onChange}
            placeholder="Description of the lottery set..."
            rows={3}
          />
        </div>
        {/* Why Collect */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            Why Collect
            {(formData.whyCollect || []).length < 3 && (
              <Button
                type="button"
                variant="ghost"
                size="none"
                className="hover:bg-transparent hover:text-blue-500"
                onClick={addWhyCollectPoint}
              >
                <Plus /> Add Point
              </Button>
            )}
          </Label>
          <div className="space-y-2">
            {(formData.whyCollect || []).map((point, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Textarea
                  value={point}
                  onChange={(e) => handleWhyCollectChange(idx, e.target.value)}
                  placeholder={`Reason #${idx + 1} to collect this set...`}
                  rows={2}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWhyCollectPoint(idx)}
                  disabled={(formData.whyCollect || []).length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Add up to 3 reasons why collectors should want this set.
            </p>
          </div>
        </div>
        {/* Prices */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="ticketPrice">Ticket Price</Label>
            <Input
              id="ticketPrice"
              name="ticketPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.ticketPrice || ""}
              onChange={onChange}
              placeholder="e.g., 2.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketPrice">Market Price</Label>
            <Input
              id="marketPrice"
              name="marketPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.marketPrice || ""}
              onChange={onChange}
              placeholder="e.g., 100.00"
            />
          </div>
        </div>
        {/* Draw Date & Time */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="drawDate">Draw Date</Label>
            <Input
              id="drawDate"
              name="drawDate"
              type="date"
              value={formData.drawDate ? formData.drawDate.slice(0, 10) : ""}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drawTime">Draw Time</Label>
            <Input
              id="drawTime"
              name="drawTime"
              type="time"
              value={formData.drawTime || ""}
              onChange={onChange}
            />
          </div>
        </div>
        {/* Slots and Pieces */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="totalSlots">Total Slots</Label>
            <Input
              id="totalSlots"
              name="totalSlots"
              type="number"
              min="1"
              value={formData.totalSlots || ""}
              onChange={onChange}
              placeholder="e.g., 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pieces">Number of Pieces</Label>
            <Input
              id="pieces"
              name="pieces"
              type="number"
              min="1"
              value={formData.pieces || ""}
              onChange={onChange}
              placeholder="e.g., 100"
            />
          </div>
        </div>
        {/* Collection Dropdown */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Select
              value={formData.collection || ""}
              onValueChange={(value) =>
                onChange({ target: { name: "collection", value } })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((col) => (
                  <SelectItem key={col._id} value={col._id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Tag Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="tag">Set Tag</Label>
            <Select
              value={formData.tag || ""}
              onValueChange={(value) =>
                onChange({ target: { name: "tag", value } })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                {TAG_OPTIONS.map((tag) => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Parts Multi-Select */}
        <div className="space-y-2">
          <Label htmlFor="parts">Parts</Label>
          <Select value="" onValueChange={handleAddPart}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Add part to lottery" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((part) => (
                <SelectItem key={part._id} value={part._id}>
                  {getPartDisplay(part)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Selected Parts as badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedParts.map((partId) => {
              const part = parts.find((p) => p._id === partId);
              if (!part) return null;
              return (
                <Badge
                  variant="secondary"
                  key={partId}
                  className="flex items-center gap-2 p-2"
                >
                  {getPartDisplay(part)}
                  <button
                    type="button"
                    className="ml-1 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleRemovePart(partId)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Set Image</Label>
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Lottery preview"
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
              <div className="border-2 border-dashed rounded-md p-5 text-center">
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
      {/* Preview Column */}
      <div className="sticky top-0 h-fit space-y-4">
        <Card className="overflow-hidden rounded-xl border dark:border-none p-0 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square border-b">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Box className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
            {/* Collection Badge */}
            {formData.collection && (
              <Badge className="absolute top-2 left-2 capitalize text-xs px-2 py-1">
                {collections.find((c) => c._id === formData.collection)?.name ||
                  ""}
              </Badge>
            )}
            {/* Tag Badge */}
            {formData.tag && (
              <Badge
                variant="accent"
                className="absolute top-2 right-2 capitalize text-xs px-2 py-1"
              >
                {TAG_OPTIONS.find((t) => t.value === formData.tag)?.label ||
                  formData.tag}
              </Badge>
            )}
          </div>
          <CardContent className="p-3 space-y-2">
            <h3 className="text-lg font-semibold truncate">
              {formData.title || "Set Name"}
            </h3>
            <div className="flex justify-between text-muted-foreground">
              <div className="flex items-center gap-1">
                <Box className="w-4 h-4" />
                <span>{formData.pieces || 0} pieces</span>
              </div>
              <span className="text-emerald-500 font-bold">
                ${Number(formData.ticketPrice || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlarmClockCheck className="w-4 h-4" />
              <span>{getFormattedDrawDateTime()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {formData.totalSlots
                  ? `${formData.totalSlots} of ${formData.totalSlots} slots left`
                  : "0 of 0 slots left"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LotteryForm;
