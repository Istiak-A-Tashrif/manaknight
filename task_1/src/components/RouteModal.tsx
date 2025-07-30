import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useFlowContext } from "../store/FlowContext";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route?: {
    id: string;
    name: string;
    url: string;
    method: string;
  };
}

const createInitialFormData = () => ({
  id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: "",
  url: "",
  method: "GET",
});

export function RouteModal({ isOpen, onClose, route }: RouteModalProps) {
  const { addRoute, updateRoute, deleteRoute } = useFlowContext();
  const [formData, setFormData] = useState(createInitialFormData());

  useEffect(() => {
    if (route) {
      setFormData(route);
    } else {
      setFormData(createInitialFormData());
    }
  }, [route, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (route) {
      updateRoute(formData);
    } else {
      addRoute(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (route) {
      deleteRoute(route.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {route ? "Edit Route" : "Add New Route"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Route Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter route name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="/api/resource/:id"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          {route && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Route
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {route ? "Update" : "Save"} Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
