export interface Element {
  id: string;
  name: string;
  width: number; // Width in pixels (multiple of 64)
  height: number; // Height in pixels (multiple of 64)
  color: string; // Color for visualization
  icon?: string; // Optional icon name from lucide-react
  zIndex?: number; // For layering
}

export interface PlacedElement extends Element {
  x: number; // X position on canvas (grid coordinates)
  y: number; // Y position on canvas (grid coordinates)
  rotation?: number; // Rotation in degrees
}

export interface CanvasConfig {
  width: number; // Width in pixels (multiple of 64)
  height: number; // Height in pixels (multiple of 64)
  gridSize: number; // Size of each grid cell in pixels (default: 64)
  backgroundColor: string;
}

export interface CanvasState {
  config: CanvasConfig;
  elements: PlacedElement[];
  selectedElementId: string | null;
  history: PlacedElement[][];
  historyIndex: number;
  isDarkMode: boolean;
}

export type Action = 
  | { type: 'ADD_ELEMENT'; element: PlacedElement }
  | { type: 'REMOVE_ELEMENT'; id: string }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'UPDATE_ELEMENT'; element: Partial<PlacedElement> & { id: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'TOGGLE_DARK_MODE' };