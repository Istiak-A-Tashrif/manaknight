import React from 'react';
import { PenLine, Type, Calendar, CheckSquare, Edit } from 'lucide-react';
import { DocumentField } from '../types';

interface DraggableFieldProps {
  type: DocumentField['type'];
}

const fieldIcons = {
  signature: PenLine,
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  initial: Edit,
};

export const DraggableField: React.FC<DraggableFieldProps> = ({
  type
}) => {
  const Icon = fieldIcons[type];
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('fieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50 bg-blue-50' : ''
      }`}
    >
      <Icon className="w-5 h-5 mr-2 text-blue-600" />
      <span className="capitalize">{type}</span>
    </div>
  );
};