import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ColorForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="color_name">Color Name</Label>
        <Input
          id="color_name"
          name="color_name"
          value={formData.color_name || ""}
          onChange={onChange}
          placeholder="e.g., Bright Red, Dark Green"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hex_code">Hex Code</Label>
        <div className="flex items-center gap-3">
          <Input
            id="hex_code"
            name="hex_code"
            value={formData.hex_code?.toLowerCase() || ""}
            onChange={onChange}
            placeholder="#ff0000"
            required
            className="w-full"
          />
          <Input
            type="color"
            value={formData.hex_code || "#000000"}
            onChange={(e) =>
              onChange({
                target: { name: "hex_code", value: e.target.value },
              })
            }
            className="h-10 w-12 p-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorForm;
