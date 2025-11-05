import { Download, X } from "lucide-react";
import { Button } from "./ui/button";

interface SelectionCounterProps {
  count: number;
  onClear: () => void;
}

export const SelectionCounter = ({ count, onClear }: SelectionCounterProps) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-primary text-primary-foreground rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
        <span className="font-semibold text-lg">
          {count} {count === 1 ? "image" : "images"} selected
        </span>
        <div className="flex items-center gap-2">

          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="rounded-full h-9 w-9 p-0 hover:bg-primary-foreground/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};