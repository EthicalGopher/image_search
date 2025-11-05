import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for high-resolution images..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 sm:h-16 pl-4 sm:pl-6 pr-12 sm:pr-16 text-base sm:text-lg rounded-full bg-card border border-border focus:border-primary transition-colors shadow-md"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
