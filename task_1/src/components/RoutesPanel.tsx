import { Code, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { useFlowContext } from "../store/FlowContext";
import { RouteFlowEditor } from "./RouteFlowEditor";
import { RouteModal } from "./RouteModal";

export function RoutesPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const { routes } = useFlowContext();

  return (
    <div className="flex flex-col h-full">
      {!editingRoute ? (
        <>
          <div className="p-4">
            <button
              onClick={() => {
                setSelectedRoute(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              <Plus className="w-4 h-4" />
              Add Route
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{route.name}</h3>
                      <p className="text-sm text-gray-500">
                        {route.method} {route.url}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoute(route);
                          setIsModalOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit Route"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingRoute(route)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit Components"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RouteModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRoute(null);
            }}
            route={selectedRoute}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-white">
          <RouteFlowEditor
            route={editingRoute}
            onClose={() => setEditingRoute(null)}
          />
        </div>
      )}
    </div>
  );
}
