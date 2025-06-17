import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Box, AlarmClockCheck, Users, UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LotteryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    whyCollect: [""],
    ticketPrice: "",
    marketPrice: "",
    drawDate: "",
    drawTime: "",
    totalSlots: "",
    pieces: "",
    collection: "",
    tag: "",
    image: null,
    imagePreview: null,
  });

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

  const addWhyCollectPoint = () => {
    if (formData.whyCollect.length < 3) {
      setFormData({
        ...formData,
        whyCollect: [...formData.whyCollect, ""],
      });
    }
  };

  const updateWhyCollectPoint = (index, value) => {
    const newPoints = [...formData.whyCollect];
    newPoints[index] = value;
    setFormData({ ...formData, whyCollect: newPoints });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Form Column */}
      <div className="space-y-5">
        {/* Basic Information */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Set Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Hogwarts Castle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description of the lottery set..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              Why Collect
              {formData.whyCollect.length < 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="none"
                  className="hover:bg-transparent hover:text-blue-500"
                  onClick={addWhyCollectPoint}
                >
                  <Plus />
                  Add Point
                </Button>
              )}
            </Label>

            <div className="space-y-2">
              {formData.whyCollect.map((point, index) => (
                <Textarea
                  key={index}
                  value={point}
                  onChange={(e) => updateWhyCollectPoint(index, e.target.value)}
                  placeholder={`Reason # ${index + 1} to collect this set...`}
                  rows={2}
                />
              ))}

              <p className="text-xs text-muted-foreground">
                Add up to 3 reasons why collectors should want this set.
              </p>
            </div>
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-5 pt-3">
          <div className="space-y-2">
            <Label htmlFor="ticketPrice">Ticket Price</Label>
            <Input
              id="ticketPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
              placeholder="e.g., 2.99"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketPrice">Market Price</Label>
            <Input
              id="marketPrice"
              type="number"
              value={formData.marketPrice}
              placeholder="e.g., 100.00"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="drawDate">Draw Date</Label>
            <Input
              id="drawDate"
              type="date"
              value={formData.drawDate}
              onChange={(e) =>
                setFormData({ ...formData, drawDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drawTime">Draw Time</Label>
            <Input
              id="drawTime"
              type="time"
              value={formData.drawTime}
              onChange={(e) =>
                setFormData({ ...formData, drawTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* Slots and Pieces */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="totalSlots">Total Slots</Label>
            <Input
              id="totalSlots"
              type="number"
              min="1"
              value={formData.totalSlots}
              onChange={(e) =>
                setFormData({ ...formData, totalSlots: e.target.value })
              }
              placeholder="e.g., 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pieces">Number of Pieces</Label>
            <Input
              id="pieces"
              type="number"
              min="1"
              value={formData.pieces}
              onChange={(e) =>
                setFormData({ ...formData, pieces: e.target.value })
              }
              placeholder="e.g., 100"
            />
          </div>
        </div>

        {/* Collection and Tag */}
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Select
              value={formData.collection}
              onValueChange={(value) =>
                setFormData({ ...formData, collection: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harry-potter">Harry Potter</SelectItem>
                <SelectItem value="marvel">Marvel</SelectItem>
                <SelectItem value="star-wars">Star Wars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Set Tag</Label>
            <Select
              value={formData.tag}
              onValueChange={(value) =>
                setFormData({ ...formData, tag: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Set Image</Label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer">
            <label
              htmlFor="image"
              className="flex flex-col items-center space-y-2"
            >
              <UploadCloud className="w-10 h-10 text-gray-500" />
              <span className="text-sm text-gray-600">
                Upload an image or drag and drop
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG, GIF up to 10MB
              </span>
              <Input
                id="image"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Preview Column */}
      <div className="sticky top-0 h-fit space-y-4">
        {/* Preview Card */}

        <Card className="overflow-hidden rounded-xl border dark:border-none p-0 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square border-b">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt={formData.name}
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
                {formData.collection}
              </Badge>
            )}

            {/* Tag Badge */}
            {formData.tag && (
              <Badge
                variant="accent"
                className="absolute top-2 right-2 capitalize text-xs px-2 py-1"
              >
                {formData.tag}
              </Badge>
            )}
          </div>

          <CardContent className="p-3 space-y-2">
            <h3 className="text-lg font-semibold truncate">
              {formData.name || "Set Name"}
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
              <span>
                {formData.drawDate && formData.drawTime
                  ? new Date(
                      `${formData.drawDate}T${formData.drawTime}`
                    ).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "America/New_York", // EST
                    }) + " EST"
                  : "Draw Date"}
              </span>
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
