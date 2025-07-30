import React from 'react';
import { DraggableField } from './DraggableField';
import type { DocumentField } from '../types';

export const EditorSidebar: React.FC = () => {
  const fieldTypes: DocumentField['type'][] = [
    'signature',
    'text',
    'date',
    'checkbox',
    'initial',
  ];

  return (
    <div className="w-64 bg-white p-4 border-r">
      <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
      <div className="space-y-2">
        {fieldTypes.map((type) => (
          <DraggableField key={type} type={type} />
        ))}
      </div>
    </div>
  );
};