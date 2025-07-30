import { Edit2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFlowContext } from "../store/FlowContext";
import { DefaultTablesModal } from "./DefaultTablesModal";
import { ModelModal } from "./ModelModal";

export function ModelPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDefaultTablesModalOpen, setIsDefaultTablesModalOpen] =
    useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const { models, defaultTablesShown, setDefaultTablesShown } = useFlowContext();

  useEffect(() => {
    // Show default tables modal only if there are no models and it hasn't been shown before
    if (models.length === 0 && !defaultTablesShown) {
      setIsDefaultTablesModalOpen(true);
      setDefaultTablesShown(true); // Mark as shown
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleEditModel = (model: any) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setSelectedModel(null);
          setIsModalOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Model
      </button>

      <div className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{model.name}</h3>
                <p className="text-sm text-gray-500">
                  {model.fields.length} field
                  {model.fields.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditModel(model);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModel(null);
        }}
        model={selectedModel}
      />

      <DefaultTablesModal
        isOpen={isDefaultTablesModalOpen}
        onClose={() => setIsDefaultTablesModalOpen(false)}
      />
    </div>
  );
}
