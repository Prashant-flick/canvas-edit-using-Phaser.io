import React from 'react';
import { Undo2, Redo2, Sun, Moon, Trash2, Save, Download } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

const Toolbar: React.FC = () => {
  const dispatch = useCanvasStore(state => state.dispatch);
  const isDarkMode = useCanvasStore(state => state.isDarkMode);
  const elements = useCanvasStore(state => state.elements);
  
  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };
  
  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };
  
  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      dispatch({ type: 'CLEAR_CANVAS' });
    }
  };
  
  const handleToggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };
  
  const handleExport = () => {
    const data = {
      elements,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-layout.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div 
      className={`h-16 flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Canvas Editor</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={handleUndo}
          title="Undo"
        >
          <Undo2 size={20} />
        </button>
        
        <button 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={handleRedo}
          title="Redo"
        >
          <Redo2 size={20} />
        </button>
        
        <div className="mx-2 h-6 w-px bg-gray-500 opacity-30"></div>
        
        <button 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={handleClear}
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>
        
        <button 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={handleExport}
          title="Export Layout"
        >
          <Download size={20} />
        </button>
        
        <div className="mx-2 h-6 w-px bg-gray-500 opacity-30"></div>
        
        <button 
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={handleToggleDarkMode}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;