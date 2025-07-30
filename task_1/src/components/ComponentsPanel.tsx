import React from 'react';
import { Lock, Globe, ArrowUpDown, Code, Database, Variable } from 'lucide-react';

const components = [
  { id: 'auth', name: 'Authentication', icon: Lock },
  { id: 'url', name: 'URL Route', icon: Globe },
  { id: 'output', name: 'Output Data', icon: ArrowUpDown },
  { id: 'logic', name: 'Logic', icon: Code },
  { id: 'variable', name: 'Variable', icon: Variable },
  { id: 'db-find', name: 'DB Find', icon: Database },
  { id: 'db-insert', name: 'DB Insert', icon: Database },
  { id: 'db-update', name: 'DB Update', icon: Database },
  { id: 'db-delete', name: 'DB Delete', icon: Database },
  { id: 'db-query', name: 'DB Query', icon: Database },
];

export function ComponentsPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-gray-200 p-4 bg-white">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Components</h3>
      <div className="grid grid-cols-2 gap-3">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <div
              key={component.id}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
              onDragStart={(event) => onDragStart(event, component.id)}
              draggable
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm text-center">{component.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}