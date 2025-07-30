import { Edit2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFlowContext } from '../store/FlowContext';
import { RoleModal } from './RoleModal';

export function RolesPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const { roles } = useFlowContext();

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setSelectedRole(null);
          setIsModalOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Role
      </button>

      <div className="space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.slug}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedRole(role);
                  setIsModalOpen(true);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
      />
    </div>
  );
}