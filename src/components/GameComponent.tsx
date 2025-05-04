import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { elemProps } from "../App";

interface GameComponentProps {
  element: elemProps | null;
}

const GameComponent: React.FC<GameComponentProps> = ({ element }) => {
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
        this.load.atlas("avatar1-left", "/assets/avatar1-left.png", "/assets/avatar1-left.json");
        this.load.image("floor-tile", "/assets/floor-tile.png");
        this.load.image("table", "/assets/table.png");
        this.load.image("chair", "/assets/chair.png");
        this.load.image("desk", "/assets/desk.png");
        this.load.image("plant", "/assets/plant.png");
        this.load.image("bookshelf", "/assets/bookshelf.png");
        this.load.image("whiteboard", "/assets/whiteboard.png");
        this.load.image("coffeemachine", "/assets/coffeemachine.png");
        this.load.image("lamp", "/assets/lamp.png");
        this.load.image("carpet", "/assets/carpet.png");
        this.load.image("big-table", "/assets/big-table.png");
        this.load.image("chair-left", "/assets/chair-left.png");
        this.load.image("chair-front", "/assets/chair-front.png");
        this.load.image("chair-back", "/assets/chair-back.png");
        this.load.image("chair-right", "/assets/chair-right.png");
        this.load.image("pond", "/assets/pond.png");
        this.load.image("wall", "/assets/wall.png");
        this.load.image("grass", "/assets/grass.png");
        this.load.image("wall-left", "/assets/wall-left.png");
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
            depth: string;
          }>;
          const { type, x, y, depth } = e.detail;
          const worldPoint = this.cameras.main.getWorldPoint(x, y);
          const gridSize = 64;
          const tempImgae = this.add.image(0, 0, type).setVisible(false);
          const width = tempImgae.width;
          const height = tempImgae.height;
          tempImgae.destroy();

          let snappedX = Math.floor(worldPoint.x / gridSize) * gridSize;
          let snappedY = Math.floor(worldPoint.y / gridSize) * gridSize;

          if ((width / gridSize) % 2 === 1) snappedX += gridSize / 2;
          if ((height / gridSize) % 2 === 1) snappedY += gridSize / 2;

          this.add
            .image(snappedX, snappedY, type)
            .setInteractive({ draggable: true })
            .setDepth(Number(depth));
        }) as EventListener);

        this.input.on(
          "drag",
          (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image,
            dragX: number,
            dragY: number
          ) => {
            const width = gameObject.displayWidth;
            const height = gameObject.displayHeight;
            let snappedX;
            let snappedY;
            const gridSize = 64;

            if ((width / 64) % 2 === 1) {
              snappedX = Math.floor(dragX / gridSize) * gridSize + gridSize / 2;
            } else {
              snappedX = Math.floor(dragX / gridSize) * gridSize + gridSize / 2;
              snappedX += 32;
            }
            if ((height / 64) % 2 === 1) {
              snappedY = Math.floor(dragY / gridSize) * gridSize + gridSize / 2;
            } else {
              snappedY = Math.floor(dragY / gridSize) * gridSize + gridSize / 2;
              snappedY += 32;
            }

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
        let clickStartPos: { x: number; y: number } | null = null;

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
          if (pointer.rightButtonDown()) {
            isDragging = true;
            dragStartX = pointer.x;
            dragStartY = pointer.y;
          }
          if (pointer.leftButtonDown() && element) {
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
            clickStartPos = {
              x: worldPoint.x,
              y: worldPoint.y,
            };
          }
        });

        this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
          if (pointer.rightButtonReleased()) {
            isDragging = false;
          }

          if (
            pointer.leftButtonReleased() &&
            clickStartPos &&
            element &&
            Phaser.Math.Distance.Between(pointer.x, pointer.y, clickStartPos.x, clickStartPos.y) < 5
          ) {
            const gridSize = 64;
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;

            let snappedX = Math.floor(worldPoint.x / gridSize) * gridSize;
            let snappedY = Math.floor(worldPoint.y / gridSize) * gridSize;
            const tempImgae = this.add.image(0, 0, element.type).setVisible(false);
            const width = tempImgae.width;
            const height = tempImgae.height;
            tempImgae.destroy();

            if ((width / gridSize) % 2 === 1) snappedX += gridSize / 2;
            if ((height / gridSize) % 2 === 1) snappedY += gridSize / 2;

            this.add
              .image(snappedX, snappedY, element.type)
              .setInteractive({ draggable: true })
              .setDepth(element.depth);
          }
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
  }, [element]);

  return <div ref={containerRef} className="w-[1200px]" />;
};

export default GameComponent;
