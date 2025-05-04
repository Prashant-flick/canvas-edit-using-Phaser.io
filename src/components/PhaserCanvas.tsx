import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useCanvasStore } from "../store/canvasStore";
import { PlacedElement } from "../types";
import { v4 as uuidv4 } from "uuid";

class EditorScene extends Phaser.Scene {
  private gridSize: number = 64;
  private elements: PlacedElement[] = [];
  private grid!: Phaser.GameObjects.Grid;
  private selectedElement: Phaser.GameObjects.Rectangle | null = null;
  private elementGraphics: Map<string, Phaser.GameObjects.Rectangle> =
    new Map();
  private isDragging: boolean = false;
  private dispatch: (action: any) => void;
  private isDarkMode: boolean;

  constructor(dispatch: (action: any) => void, isDarkMode: boolean) {
    super({ key: "EditorScene" });
    this.dispatch = dispatch;
    this.isDarkMode = isDarkMode;
  }

  create() {
    // Create the grid
    this.createGrid();

    // Enable drag and drop from outside Phaser canvas
    this.input.dropZone = true;

    // Handle element drop events
    this.input.on(
      "drop",
      (pointer: Phaser.Input.Pointer, gameObject: any, dropZone: any) => {
        const x = Math.floor(pointer.x / this.gridSize) * this.gridSize;
        const y = Math.floor(pointer.y / this.gridSize) * this.gridSize;

        // Get the dropped element data from the dataTransfer
        const elementData = JSON.parse(
          window.localStorage.getItem("draggedElement") || "{}"
        );

        if (elementData.id) {
          // Create a new placed element with position
          const placedElement: PlacedElement = {
            ...elementData,
            id: uuidv4(), // Generate a new ID
            x: x / this.gridSize,
            y: y / this.gridSize,
          };

          // Add the element to the canvas state
          this.dispatch({ type: "ADD_ELEMENT", element: placedElement });

          // Clear the temporary storage
          window.localStorage.removeItem("draggedElement");
        }
      }
    );

    // Handle element selection
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // Check if clicked on an element
      const x = pointer.x;
      const y = pointer.y;

      let clickedElement: PlacedElement | undefined;

      for (const element of this.elements) {
        const elX = element.x * this.gridSize;
        const elY = element.y * this.gridSize;

        if (
          x >= elX &&
          x <= elX + element.width &&
          y >= elY &&
          y <= elY + element.height
        ) {
          clickedElement = element;
          break;
        }
      }

      if (clickedElement) {
        this.dispatch({ type: "SELECT_ELEMENT", id: clickedElement.id });
        this.isDragging = true;
      } else {
        this.dispatch({ type: "SELECT_ELEMENT", id: null });
      }
    });

    // Handle element dragging
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && this.selectedElement) {
        const selectedId = this.selectedElement.getData("id");
        const x = Math.floor(pointer.x / this.gridSize);
        const y = Math.floor(pointer.y / this.gridSize);

        this.dispatch({ type: "MOVE_ELEMENT", id: selectedId, x, y });
      }
    });

    // Handle element drop after dragging
    this.input.on("pointerup", () => {
      this.isDragging = false;
    });
  }

  createGrid() {
    // Get canvas dimensions
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    // Create a grid background
    const gridColor = this.isDarkMode ? 0x333333 : 0xdddddd;

    // Draw the grid lines
    const grid = this.add.grid(
      0,
      0,
      width,
      height,
      this.gridSize,
      this.gridSize,
      0x000000,
      0,
      gridColor,
      0.5
    );
    grid.setOrigin(0, 0);

    this.grid = grid;
  }

  updateElements(elements: PlacedElement[], selectedElementId: string | null) {
    // Clear previous elements
    this.elementGraphics.forEach((graphic) => {
      graphic.destroy();
    });
    this.elementGraphics.clear();
    this.selectedElement = null;

    // Update the local elements list
    this.elements = elements;

    // Render each element
    elements.forEach((element) => {
      const isSelected = element.id === selectedElementId;
      const x = element.x * this.gridSize;
      const y = element.y * this.gridSize;

      // Create rectangle for the element
      const rect = this.add.rectangle(
        x,
        y,
        element.width,
        element.height,
        parseInt(element.color.replace("#", "0x")),
        0.8
      );
      rect.setOrigin(0, 0);
      rect.setStrokeStyle(isSelected ? 3 : 1, isSelected ? 0xffffff : 0x000000);
      rect.setData("id", element.id);

      // If selected, store reference
      if (isSelected) {
        this.selectedElement = rect;
      }

      // Add text label
      const text = this.add.text(
        x + element.width / 2,
        y + element.height / 2,
        element.name,
        {
          fontFamily: "Arial",
          fontSize: "14px",
          color: "#ffffff",
        }
      );
      text.setOrigin(0.5, 0.5);

      // Add the element to the map for easy reference
      this.elementGraphics.set(element.id, rect);
    });
  }

  updateDarkMode(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;

    // Update grid color
    const gridColor = isDarkMode ? 0x333333 : 0xdddddd;
    if (this.grid) {
      this.grid.destroy();

      // Recreate grid with new color
      const width = this.sys.game.config.width as number;
      const height = this.sys.game.config.height as number;

      this.grid = this.add.grid(
        0,
        0,
        width,
        height,
        this.gridSize,
        this.gridSize,
        0x000000,
        0,
        gridColor,
        0.5
      );
      this.grid.setOrigin(0, 0);
    }
  }

  update() {
    // Update is handled by React state changes
  }
}

interface PhaserCanvasProps {
  playerName: string;
}

const PhaserCanvas: React.FC<PhaserCanvasProps> = ({ playerName }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Define the scene class with access to playerName
    class MyScene extends Phaser.Scene {
      playerText?: Phaser.GameObjects.Text;

      constructor() {
        super("MyScene");
      }

      preload() {
        this.load.image("logo", "/logo.png"); // Replace with your image path
      }

      create() {
        this.add.image(400, 300, "logo");
        this.playerText = this.add.text(10, 10, `Player: ${playerName}`, {
          fontSize: "20px",
          color: "#ffffff",
        });
      }

      update() {
        // Optional updates
      }
    }

    if (!gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: "phaser-container",
        scene: MyScene,
      };

      gameRef.current = new Phaser.Game(config);
    } else {
      // Update player name text if already created
      const scene = gameRef.current.scene.keys["MyScene"] as MyScene;
      if (scene?.playerText) {
        scene.playerText.setText(`Player: ${playerName}`);
      }
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [playerName]);

  return <div id="phaser-container" />;
};

export default PhaserCanvas;
