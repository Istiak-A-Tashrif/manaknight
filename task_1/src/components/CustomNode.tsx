import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Lock, Globe, ArrowUpDown, Code, Database, Variable } from 'lucide-react';

const CustomNode = ({ data, type }: NodeProps) => {
  const getIcon = () => {
    switch (type) {
      case 'auth':
        return <Lock className="w-5 h-5" />;
      case 'url':
        return <Globe className="w-5 h-5" />;
      case 'output':
        return <ArrowUpDown className="w-5 h-5" />;
      case 'logic':
        return <Code className="w-5 h-5" />;
      case 'variable':
        return <Variable className="w-5 h-5" />;
      case 'db-find':
      case 'db-insert':
      case 'db-update':
      case 'db-delete':
      case 'db-query':
        return <Database className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 min-w-[180px] cursor-grab active:cursor-grabbing">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-50 mr-2">
          {getIcon()}
        </div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">
            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
};

export default memo(CustomNode);