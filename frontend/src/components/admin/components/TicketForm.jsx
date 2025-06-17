import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const TicketForm = ( ) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter banner title" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="badge">Badge</Label>
        <Select>
          <SelectTrigger id="badge">
            <SelectValue placeholder="Select badge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="welcome">Welcome</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="new">New Arrival</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" />
      </div>
    </div>
  );
};

export default TicketForm;
