import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const GameComponent: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    class DragDropScene extends Phaser.Scene {
      spacex = Math.floor(1600 / 64) * 64;
      spacey = Math.floor(1200 / 64) * 64;
      camera!: Phaser.Cameras.Scene2D.Camera;

      constructor() {
        super("DragDropScene");
      }

      preload() {
        this.load.image("floor-tile", "/assets/floor-tile.png");
        this.load.image("table", "/assets/table.png");
        this.load.image("chair-front", "/assets/chair-front.png");
        this.load.image("chair-back", "/assets/chair-back.png");
        this.load.image("chair-left", "/assets/chair-left.png");
        this.load.image("chair-right", "/assets/chair-right.png");
      }

      create() {
        this.camera = this.cameras.main;
        this.drawGrid();

        // Drag and drop
        window.addEventListener("drop-on-canvas", ((event: Event) => {
          const e = event as CustomEvent<{
            type: string;
            x: number;
            y: number;
          }>;
          const { type, x, y } = e.detail;

          // Snap to nearest grid point
          const gridSize = 64;
          const snappedX = Math.floor(x / gridSize) * gridSize + gridSize / 2;
          const snappedY = Math.floor(y / gridSize) * gridSize + gridSize / 2;

          this.add.image(snappedX, snappedY, type).setInteractive({ draggable: true });
        }) as EventListener);

        this.input.on(
          "drag",
          (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image,
            dragX: number,
            dragY: number
          ) => {
            const gridSize = 64;
            const snappedX = Math.floor(dragX / gridSize) * gridSize + gridSize / 2;
            const snappedY = Math.floor(dragY / gridSize) * gridSize + gridSize / 2;

            gameObject.setPosition(snappedX, snappedY);
          }
        );

        // Zoom control with wheel
        this.input.on(
          "wheel",
          (
            pointer: Phaser.Input.Pointer,
            gameObjects: Phaser.GameObjects.GameObject,
            deltaX: number,
            deltaY: number,
            deltaZ: number
          ) => {
            const zoomChange = deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Phaser.Math.Clamp(this.camera.zoom + zoomChange, 0.5, 3);
            this.camera.setZoom(newZoom);
          }
        );

        this.input.mouse?.disableContextMenu();

        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
          if (pointer.rightButtonDown()) {
            isDragging = true;
            dragStartX = pointer.x;
            dragStartY = pointer.y;
          }
        });

        this.input.on("pointerup", () => {
          isDragging = false;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
          if (isDragging) {
            const dragX = (pointer.x - dragStartX) / this.cameras.main.zoom;
            const dragY = (pointer.y - dragStartY) / this.cameras.main.zoom;

            this.cameras.main.scrollX -= dragX;
            this.cameras.main.scrollY -= dragY;

            dragStartX = pointer.x;
            dragStartY = pointer.y;
          }
        });
      }

      drawGrid(): void {
        const gridSize = 64;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xaaaaaa, 0.3);

        for (let x = 0; x <= this.spacex; x += gridSize) {
          graphics.beginPath();
          graphics.moveTo(x, 0);
          graphics.lineTo(x, this.spacey);
          graphics.strokePath();
        }

        for (let y = 0; y <= this.spacey; y += gridSize) {
          graphics.beginPath();
          graphics.moveTo(0, y);
          graphics.lineTo(this.spacex, y);
          graphics.strokePath();
        }
      }
    }

    if (!gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: Math.floor(1600 / 64) * 64,
        height: Math.floor(1200 / 64) * 64,
        backgroundColor: "#f0f0f0",
        parent: containerRef.current!,
        scene: DragDropScene,
      };
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-[1200px]" />;
};

export default GameComponent;
