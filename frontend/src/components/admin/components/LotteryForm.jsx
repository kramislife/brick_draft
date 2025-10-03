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
import { useGetCollectionsQuery } from "@/redux/api/collectionApi";
import { useGetPartsQuery } from "@/redux/api/partItemApi";
import { format } from "date-fns";
import Papa from "papaparse";
import TableLayout from "@/components/admin/shared/TableLayout";

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

  // CSV upload state
  const [csvParts, setCsvParts] = useState([]);
  const [csvError, setCsvError] = useState("");

  useEffect(() => {
    if (!formData.image) {
      setImagePreview("");
    } else if (typeof formData.image === "string") {
      setImagePreview(formData.image);
    } else if (formData.image.url) {
      setImagePreview(formData.image.url);
    }
  }, [formData.image]);

  // Only display these fields in the CSV preview, in this order
  const CSV_DISPLAY_FIELDS = [
    "item_id",
    "part_id",
    "name",
    "color",
    "weight",
    "price",
    "quantity",
  ];
  const csvColumns = CSV_DISPLAY_FIELDS.map((col) => ({
    accessorKey: col,
    header: col.charAt(0).toUpperCase() + col.slice(1),
    cell: ({ row }) => {
      const value = row.original[col];
      if (typeof value === "object" && value !== null) {
        if (col === "color" && value.color_name) {
          return value.color_name;
        }
        return JSON.stringify(value);
      }
      return value;
    },
  }));

  // CSV file handler
  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    setCsvError("");
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setCsvError("CSV parsing error: " + results.errors[0].message);
            setCsvParts([]);
          } else {
            // Filter out empty rows and ensure required fields exist
            // Only item_id and name are required; part_id and color are optional
            const filtered = results.data.filter(
              (row) => row.item_id && row.name
            );
            setCsvParts(filtered);
            // Update formData.parts for submission
            onChange({ target: { name: "parts", value: filtered } });
          }
        },
        error: (err) => {
          setCsvError("CSV parsing failed: " + err.message);
          setCsvParts([]);
        },
      });
    } else {
      setCsvParts([]);
      onChange({ target: { name: "parts", value: [] } });
    }
  };

  useEffect(() => {
    // If editing and parts are present, initialize CSV preview
    if (formData.parts && formData.parts.length > 0 && csvParts.length === 0) {
      // Flatten parts data for CSV preview (handle both object and string formats)
      const flattenedParts = formData.parts.map((part) => ({
        item_id: part.item_id || part.part?.item_id || "",
        part_id: part.part_id || part.part?.part_id || "",
        name: part.name || part.part?.name || "",
        color:
          typeof part.color === "object"
            ? part.color?.color_name || ""
            : part.color || "",
        weight: part.weight || part.part?.weight || "",
        price: part.price || part.part?.price || "",
        quantity: part.quantity || part.part?.quantity || "",
      }));
      setCsvParts(flattenedParts);
    }
    // eslint-disable-next-line
  }, [formData.parts]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Form Column */}
      <div className="space-y-5 col-span-2">
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
            {(formData.whyCollect?.length ?? 0) < 3 && (
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
            {/* Always show at least one textarea */}
            {(formData.whyCollect && formData.whyCollect.length > 0
              ? formData.whyCollect
              : [""]
            ).map((point, idx) => (
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
                  disabled={
                    (formData.whyCollect?.length ?? 0) === 1 || idx === 0
                  }
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
        {/* Parts CSV Upload */}
        <div className="space-y-2">
          <Label htmlFor="partsCsv">Parts (CSV Upload)</Label>
          <div className="space-y-3">
            {csvParts.length > 0 ? (
              <div className="relative  rounded-md p-3 bg-muted">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-xs">
                    CSV Preview (first 10 rows):
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      setCsvParts([]);
                      setCsvError("");
                      onChange({ target: { name: "parts", value: [] } });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <TableLayout
                    columns={csvColumns}
                    data={csvParts.slice(0, 10)}
                  />
                  {csvParts.length > 10 && (
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                      ... {csvParts.length - 10} more rows
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-5 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("partsCsv").click()}
                  >
                    Choose CSV File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a CSV file with columns: item_id (required), name
                  (required), part_id (optional), color (optional), etc.
                </p>
                {csvError && (
                  <div className="text-xs text-red-500 mt-1">{csvError}</div>
                )}
              </div>
            )}
            <Input
              id="partsCsv"
              name="partsCsv"
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
              className="hidden"
            />
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
                  className="w-full h-48 object-contain rounded-md border p-1"
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
      <div className="sticky top-0 h-fit space-y-4 col-span-1">
        <Card className="overflow-hidden rounded-xl border dark:border-none p-0 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square border-b">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={formData.title}
                className="w-full h-full object-contain p-1"
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
