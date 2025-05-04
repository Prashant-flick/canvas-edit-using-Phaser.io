import React, { useCallback, useState } from "react";
import GameComponent from "./components/GameComponent";

export interface elemProps {
  type: string;
  label: string;
  depth: number;
}

const elements = [
  { type: "floor-tile", label: "Floor-Tile", depth: -10 },
  { type: "table", label: "Table", depth: 0 },
  { type: "chair-left", label: "Chair-Left", depth: 0 },
  { type: "chair-right", label: "Chair-Right", depth: 0 },
  { type: "chair-front", label: "Chair-Front", depth: 0 },
  { type: "chair-back", label: "Chair-Back", depth: 0 },
  { type: "big-table", label: "Big-Chair", depth: 0 },
  { type: "desk", label: "Desk", depth: 0 },
  { type: "plant", label: "Plant", depth: 0 },
  { type: "bookshelf", label: "BookShelf", depth: 0 },
  { type: "whiteboard", label: "WhiteBoard", depth: 0 },
  { type: "lamp", label: "Lamp", depth: 0 },
  { type: "carpet", label: "Carpet", depth: 0 },
  { type: "pond", label: "Pond", depth: 0 },
  { type: "wall", label: "Wall-Horizontal", depth: 0 },
  { type: "wall-left", label: "Wall-Vertical", depth: 0 },
  { type: "grass", label: "Grass", depth: -9 },
];

const App: React.FC = () => {
  const [currElem, setCurrElem] = useState<elemProps | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, type: string, depth: number) => {
      e.dataTransfer.setData("type", type);
      e.dataTransfer.setData("depth", depth.toString());
    },
    [currElem]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const depth = e.dataTransfer.getData("depth");
    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();

    const detail = {
      type,
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
      depth,
    };

    window.dispatchEvent(new CustomEvent("drop-on-canvas", { detail }));
  };

  return (
    <div className="flex h-screen pl-5 box-border pt-5 pb-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 flex justify-center w-[1200px] h-full overflow-hidden"
      >
        <GameComponent element={currElem} />
      </div>

      <div className="ml-5 flex flex-col gap-4 overflow-y-auto w-[280px]">
        <h3 className="text-lg font-semibold">Elements</h3>
        {elements.map((el) => (
          <div
            key={el.type}
            draggable
            onDragStart={(e) => {
              setCurrElem(el);
              handleDragStart(e, el.type, el.depth);
            }}
            onClick={() => {
              setCurrElem(el);
            }}
            className={`w-full h-full border border-gray-500 flex flex-col items-center justify-center cursor-grab font-bold ${
              currElem?.type === el.type ? "bg-gray-300" : "bg-gray-100"
            }`}
          >
            <img src={`/assets/${el.type}.png`} alt="no image" />
            {el.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
