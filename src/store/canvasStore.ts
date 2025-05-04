import { create } from 'zustand';
import { CanvasState, PlacedElement, Action } from '../types';

// Default canvas configuration
const DEFAULT_CONFIG = {
  width: 640, // 10 blocks of 64px
  height: 640, // 10 blocks of 64px
  gridSize: 64,
  backgroundColor: '#2d3748', // Dark background for dark mode
};

// Initial state
const initialState: CanvasState = {
  config: DEFAULT_CONFIG,
  elements: [],
  selectedElementId: null,
  history: [[]],
  historyIndex: 0,
  isDarkMode: true,
};

// Reducer function to handle state updates
const reducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElements = [...state.elements, action.element];
      return {
        ...state,
        elements: newElements,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          newElements,
        ],
        historyIndex: state.historyIndex + 1,
      };
    }
    
    case 'REMOVE_ELEMENT': {
      const newElements = state.elements.filter(el => el.id !== action.id);
      return {
        ...state,
        elements: newElements,
        selectedElementId: state.selectedElementId === action.id ? null : state.selectedElementId,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          newElements,
        ],
        historyIndex: state.historyIndex + 1,
      };
    }
    
    case 'MOVE_ELEMENT': {
      const newElements = state.elements.map(el => 
        el.id === action.id ? { ...el, x: action.x, y: action.y } : el
      );
      
      return {
        ...state,
        elements: newElements,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          newElements,
        ],
        historyIndex: state.historyIndex + 1,
      };
    }
    
    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.id,
      };
    }
    
    case 'UPDATE_ELEMENT': {
      const newElements = state.elements.map(el => 
        el.id === action.element.id ? { ...el, ...action.element } : el
      );
      
      return {
        ...state,
        elements: newElements,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          newElements,
        ],
        historyIndex: state.historyIndex + 1,
      };
    }
    
    case 'UNDO': {
      if (state.historyIndex > 0) {
        return {
          ...state,
          elements: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }
    
    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          elements: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }
    
    case 'CLEAR_CANVAS': {
      return {
        ...state,
        elements: [],
        selectedElementId: null,
        history: [...state.history, []],
        historyIndex: state.history.length,
      };
    }
    
    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    }
    
    default:
      return state;
  }
};

// Create the store
export const useCanvasStore = create<CanvasState & {
  dispatch: (action: Action) => void;
}>((set) => ({
  ...initialState,
  dispatch: (action) => set(state => reducer(state, action)),
}));