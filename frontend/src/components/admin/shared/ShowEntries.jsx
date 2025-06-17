import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ShowEntries = ({ value, onChange, totalEntries }) => {
  const entryOptions = [10, 25, 50, 100];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Show</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          {entryOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value={totalEntries.toString()}>All</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">entries</span>
    </div>
  );
};

export default ShowEntries;
