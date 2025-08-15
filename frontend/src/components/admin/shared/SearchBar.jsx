import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder, disabled = false }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 truncate"
        disabled={disabled}
      />
    </div>
  );
};

export default SearchBar;
