import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

interface Image {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string;
  user: { name: string };
}

interface ImageGridProps {
  images: Image[];
  selectedImages: string[];
  onToggleSelect: (id: string) => void;
}

export const ImageGrid = ({ images, selectedImages, onToggleSelect }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => onToggleSelect(image.id)}
        >
          <img
            src={image.urls.small}
            alt={image.alt_description || "Image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 right-3 z-10">
            <div className="p-1.5 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg">
              <Checkbox
                checked={selectedImages.includes(image.id)}
                onCheckedChange={() => onToggleSelect(image.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium truncate">{image.user.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
