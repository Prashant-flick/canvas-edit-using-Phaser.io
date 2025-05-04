import { Element } from '../types';

// Example elements that can be placed on the canvas
export const availableElements: Element[] = [
  {
    id: 'element-1',
    name: 'Wall',
    width: 64,
    height: 64,
    color: '#4b5563',
    icon: 'Square',
  },
  {
    id: 'element-2',
    name: 'Door',
    width: 64,
    height: 128,
    color: '#8b5cf6',
    icon: 'DoorClosed',
  },
  {
    id: 'element-3',
    name: 'Window',
    width: 128,
    height: 64,
    color: '#60a5fa',
    icon: 'Blinds',
  },
  {
    id: 'element-4',
    name: 'Table',
    width: 128,
    height: 128,
    color: '#f59e0b',
    icon: 'Table2',
  },
  {
    id: 'element-5',
    name: 'Chair',
    width: 64,
    height: 64,
    color: '#10b981',
    icon: 'Sofa',
  },
  {
    id: 'element-6',
    name: 'Plant',
    width: 64,
    height: 64,
    color: '#34d399',
    icon: 'Flower2',
  },
  {
    id: 'element-7',
    name: 'Bookshelf',
    width: 192,
    height: 64,
    color: '#9333ea',
    icon: 'Library',
  },
  {
    id: 'element-8',
    name: 'Bed',
    width: 128,
    height: 192,
    color: '#ec4899',
    icon: 'Bed',
  },
];