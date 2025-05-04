import React from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { X, RotateCcw, Copy } from 'lucide-react';

const ElementInspector: React.FC = () => {
  const elements = useCanvasStore(state => state.elements);
  const selectedElementId = useCanvasStore(state => state.selectedElementId);
  const dispatch = useCanvasStore(state => state.dispatch);
  const isDarkMode = useCanvasStore(state => state.isDarkMode);
  
  // Find the selected element
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  if (!selectedElement) return null;
  
  const handleRemove = () => {
    dispatch({ type: 'REMOVE_ELEMENT', id: selectedElement.id });
  };
  
  const handleRotate = () => {
    // Implementation for rotating elements could be added here
    // For now, we can just log that it's not implemented
    alert('Rotation not implemented in this version');
  };
  
  const handleDuplicate = () => {
    // Create a duplicate element with a new ID
    const duplicate = {
      ...selectedElement,
      id: `element-${Date.now()}`,
      x: selectedElement.x + 1, // Offset slightly
      y: selectedElement.y + 1,
    };
    
    dispatch({ type: 'ADD_ELEMENT', element: duplicate });
  };

  return (
    <div 
      className={`absolute bottom-4 left-4 p-4 rounded-lg shadow-md z-10 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">{selectedElement.name}</h3>
        <button
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => dispatch({ type: 'SELECT_ELEMENT', id: null })}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs opacity-70">Position</p>
          <p className="font-medium">
            ({selectedElement.x}, {selectedElement.y})
          </p>
        </div>
        <div>
          <p className="text-xs opacity-70">Size</p>
          <p className="font-medium">
            {selectedElement.width}x{selectedElement.height}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-2 border-t border-gray-700">
        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } transition-colors`}
          onClick={handleRotate}
        >
          <RotateCcw size={14} />
          <span className="text-sm">Rotate</span>
        </button>
        
        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } transition-colors`}
          onClick={handleDuplicate}
        >
          <Copy size={14} />
          <span className="text-sm">Duplicate</span>
        </button>
        
        <button
          className="flex items-center space-x-1 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors ml-auto"
          onClick={handleRemove}
        >
          <X size={14} />
          <span className="text-sm">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default ElementInspector;