import React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon as LucideIconType } from "lucide-react";
import { Element } from "../types";
import { useCanvasStore } from "../store/canvasStore";

interface ElementPaletteProps {
  elements: Element[];
}

type IconName = keyof typeof LucideIcons;

const ElementPalette: React.FC<ElementPaletteProps> = ({ elements }) => {
  const isDarkMode = useCanvasStore((state) => state.isDarkMode);

  const onDragStart = (e: React.DragEvent, element: Element) => {
    e.dataTransfer.setData("application/json", JSON.stringify(element));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className={`h-full overflow-y-auto p-4 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Elements</h2>
      <p className="text-sm mb-4 opacity-70">Drag elements onto the canvas</p>
      <div className="grid grid-cols-1 gap-4">
        {elements.map((element) => {
          // Safely get the icon component with type checking
          let IconComponent = LucideIcons.Square;

          if (element.icon && typeof element.icon === "string") {
            // Check if the icon name exists in LucideIcons
            const iconName = element.icon as IconName;

            if (LucideIcons[iconName]) {
              IconComponent = LucideIcons[iconName] as LucideIconType;
            }
          }

          // Calculate how many grid blocks this element takes
          const widthBlocks = element.width / 64;
          const heightBlocks = element.height / 64;

          return (
            <div
              key={element.id}
              className={`p-4 rounded-lg cursor-grab transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              draggable
              onDragStart={(e) => onDragStart(e, element)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-md"
                  style={{ backgroundColor: element.color }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{element.name}</h3>
                  <p className="text-xs opacity-70">
                    {element.width}x{element.height} ({widthBlocks}x
                    {heightBlocks} blocks)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementPalette;
