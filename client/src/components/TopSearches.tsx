import { Badge } from "./ui/badge";

interface TopSearchesProps {
  searches: string[];
  onSearchClick: (search: string) => void;
}

export const TopSearches = ({ searches, onSearchClick }: TopSearchesProps) => {
  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-y border-border/50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Top searches:</span>
          {searches && searches.map((search) => (
            <Badge
              key={search}
              variant="outline"
              className="cursor-pointer border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-base"
              onClick={() => onSearchClick(search)}
            >
              {search}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};