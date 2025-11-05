import { Clock, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SearchHistoryProps {
  history: { term: string; timestamp: Date }[];
  onSearchClick: (search: string) => void;
  onClear: () => void;
}

export const SearchHistory = ({ history, onSearchClick, onClear }: SearchHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent Searches</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.slice(0, 10).map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(search.term)}
            className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-secondary-foreground flex items-center gap-2"
          >
            <span>{search.term}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(search.timestamp).toLocaleTimeString()}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};