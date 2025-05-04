import React from "react";
import GameComponent from "./components/GameComponent";

const elements = [
  { type: "floor-tile", label: "Floor-Tile" },
  { type: "table", label: "Table" },
  { type: "chair-left", label: "Chair-Left" },
  { type: "chair-right", label: "Chair-Right" },
  { type: "chair-front", label: "Chair-Front" },
  { type: "chair-back", label: "Chair-Back" },
];

const App: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("type", type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();

    const detail = {
      type,
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
    };

    window.dispatchEvent(new CustomEvent("drop-on-canvas", { detail }));
  };

  return (
    <div className="flex h-screen p-5 box-border w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 flex justify-center w-[1200px] h-full overflow-hidden"
      >
        <GameComponent />
      </div>

      <div className="ml-5 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Elements</h3>
        {elements.map((el) => (
          <div
            key={el.type}
            draggable
            onDragStart={(e) => handleDragStart(e, el.type)}
            className="w-20 h-20 border border-gray-500 flex items-center justify-center cursor-grab bg-gray-100 font-bold"
          >
            {el.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
