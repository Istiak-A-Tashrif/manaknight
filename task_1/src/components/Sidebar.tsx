import React, { useState } from 'react';
import { Lock, Globe, ArrowUpDown, Code, Database, Variable, Plus, X } from 'lucide-react';
import { ModelPanel } from './ModelPanel';
import { SettingsForm } from './SettingsForm';
import { RolesPanel } from './RolesPanel';
import { RoutesPanel } from './RoutesPanel';

type Tab = 'models' | 'roles' | 'routes' | 'settings';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('models');

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'models'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('models')}
        >
          Models
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'roles'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'routes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('routes')}
        >
          Routes
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'models' && <ModelPanel />}
        {activeTab === 'roles' && <RolesPanel />}
        {activeTab === 'routes' && <RoutesPanel />}
        {activeTab === 'settings' && <SettingsForm />}
      </div>
    </div>
  );
}