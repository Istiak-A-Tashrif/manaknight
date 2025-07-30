import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFlowContext } from "../store/FlowContext";

interface Field {
  name: string;
  type: string;
  defaultValue: string;
  validation: string;
  validationOptions?: {
    pattern?: string;
    enum?: string[];
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  mapping?: string;
}

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model?: {
    id: string;
    name: string;
    fields: Field[];
  };
}

const fieldTypes = [
  "primary key",
  "string",
  "long text",
  "integer",
  "double",
  "big number",
  "boolean",
  "date",
  "datetime",
  "uuid",
  "json",
  "mapping",
];

const validationRules = [
  "required",
  "email",
  "url",
  "min",
  "max",
  "pattern",
  "enum",
  "length",
  "minLength",
  "maxLength",
  "positive",
  "negative",
  "integer",
  "decimal",
  "alphanumeric",
  "uuid",
  "json",
  "date",
  "phone",
];

const initialNewField: Field = {
  name: "",
  type: "string",
  defaultValue: "",
  validation: "",
  validationOptions: {},
};

const createInitialModelData = () => ({
  id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: "",
  fields: [],
});

export function ModelModal({ isOpen, onClose, model }: ModelModalProps) {
  const [modelData, setModelData] = useState<{
    id: string;
    name: string;
    fields: Field[];
  }>(createInitialModelData());
  const [newField, setNewField] = useState<Field>(initialNewField);
  const [createCrudApis, setCreateCrudApis] = useState(false); // New state for CRUD API checkbox

  const { addModel, updateModel, addRoute } = useFlowContext();

  useEffect(() => {
    if (model) {
      setModelData({
        id: model.id,
        name: model.name,
        fields: [...model.fields],
      });
    } else {
      setModelData(createInitialModelData());
    }
  }, [model, isOpen]);

  const handleAddField = () => {
    if (newField.name) {
      setModelData({
        ...modelData,
        fields: [...modelData.fields, { ...newField }],
      });
      setNewField(initialNewField);
    }
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...modelData.fields];
    updatedFields.splice(index, 1);
    setModelData({
      ...modelData,
      fields: updatedFields,
    });
  };

  const handleSave = () => {
    if (modelData.name) {
      if (model) {
        updateModel(modelData);
      } else {
        addModel(modelData);
        if (createCrudApis) {
          // Create GET route for fetching all records
          const uniqueId = Date.now(); // Generate a unique identifier based on the current timestamp
          const getRoute = {
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `Get All ${modelData.name}`,
            method: 'GET',
            url: `/api/${modelData.name.toLowerCase()}`,
            flowData: {
              nodes: [
                {
                  id: `url_node_${uniqueId}`,
                  type: 'url',
                  position: { x: 100, y: 100 },
                  data: {
                    label: 'URL',
                    path: `/api/${modelData.name.toLowerCase()}`,
                    method: 'GET'
                  }
                },
                {
                  id: `db_find_node_${uniqueId}`,
                  type: 'db-find',
                  position: { x: 100, y: 200 },
                  data: {
                    label: 'Database Find',
                    model: modelData.name,
                    operation: 'findMany',
                    query: `SELECT * FROM ${modelData.name}`,
                    resultVar: `${modelData.name}Result`
                  }
                },
                {
                  id: `output_node_${uniqueId}`,
                  type: 'output',
                  position: { x: 100, y: 300 },
                  data: {
                    label: 'Output',
                    outputType: 'definition',
                    fields: modelData.fields.map(field => ({
                      name: field.name,
                      type: field.type === 'primary key' ? 'number' : 
                            field.type === 'long text' ? 'string' : 
                            field.type === 'big number' ? 'number' : 
                            field.type
                    })),
                    statusCode: 200
                  }
                }
              ],
              edges: [
                {
                  id: `url-to-db_${uniqueId}`,
                  source: `url_node_${uniqueId}`,
                  target: `db_find_node_${uniqueId}`
                },
                {
                  id: `db-to-output_${uniqueId}`,
                  source: `db_find_node_${uniqueId}`,
                  target: `output_node_${uniqueId}`
                }
              ]
            }
          };

          const getOneRoute = {
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `Get One ${modelData.name}`,
            method: 'GET',
            url: `/api/${modelData.name.toLowerCase()}/:id`,
            flowData: {
              nodes: [
                {
                  id: `url_node_${uniqueId}_1`,
                  type: 'url',
                  position: { x: 100, y: 100 },
                  data: {
                    label: 'URL',
                    path: `/api/${modelData.name.toLowerCase()}/:id`,
                    method: 'GET'
                  }
                },
                {
                  id: `db_find_node_${uniqueId}_1`,
                  type: 'db-find',
                  position: { x: 100, y: 200 },
                  data: {
                    label: 'Database Find',
                    model: modelData.name,
                    operation: 'findOne',
                    query: `SELECT * FROM ${modelData.name} WHERE id=id`,
                    resultVar: `${modelData.name}OneResult`
                  }
                },
                {
                  id: `output_node_${uniqueId}_1`,
                  type: 'output',
                  position: { x: 100, y: 300 },
                  data: {
                    label: 'Output',
                    outputType: 'definition',
                    fields: modelData.fields.map(field => ({
                      name: field.name,
                      type: field.type === 'primary key' ? 'number' : 
                            field.type === 'long text' ? 'string' : 
                            field.type === 'big number' ? 'number' : 
                            field.type
                    })),
                    statusCode: 200
                  }
                }
              ],
              edges: [
                {
                  id: `url-to-db_${uniqueId}_1`,
                  source: `url_node_${uniqueId}_1`,
                  target: `db_find_node_${uniqueId}_1`
                },
                {
                  id: `db-to-output_${uniqueId}_1`,
                  source: `db_find_node_${uniqueId}_1`,
                  target: `output_node_${uniqueId}_1`
                }
              ]
            }
          };

          const deleteRoute = {
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `Delete One ${modelData.name}`,
            method: 'DELETE',
            url: `/api/${modelData.name.toLowerCase()}/:id`,
            flowData: {
              nodes: [
                {
                  id: `url_node_${uniqueId}_1`,
                  type: 'url',
                  position: { x: 100, y: 100 },
                  data: {
                    label: 'URL',
                    path: `/api/${modelData.name.toLowerCase()}/:id`,
                    method: 'DELETE'
                  }
                },
                {
                  id: `db_find_node_${uniqueId}_2`,
                  type: 'db-delete',
                  position: { x: 100, y: 200 },
                  data: {
                    label: 'Database Delete',
                    model: modelData.name,
                    operation: 'findOne',
                    query: `DELETE FROM ${modelData.name} WHERE id=id`,
                    resultVar: `${modelData.name}DeleteResult`
                  }
                },
                {
                  id: `output_node_${uniqueId}_2`,
                  type: 'output',
                  position: { x: 100, y: 300 },
                  data: {
                    label: 'Output',
                    outputType: 'definition',
                    fields: [
                      {name: "error", type: "boolean"},
                      {name: "id", type: "integer"}
                    ],
                    statusCode: 200
                  }
                }
              ],
              edges: [
                {
                  id: `url-to-db_${uniqueId}_1`,
                  source: `url_node_${uniqueId}_1`,
                  target: `db_find_node_${uniqueId}_2`
                },
                {
                  id: `db-to-output_${uniqueId}_2`,
                  source: `db_find_node_${uniqueId}_2`,
                  target: `output_node_${uniqueId}_2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              `
                }
              ]
            }
          };

          addRoute(deleteRoute as any);
          addRoute(getRoute as any);
          addRoute(getOneRoute as any);
        }
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {model ? "Edit Model" : "Add New Model"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Model Name</label>
            <input
              type="text"
              value={modelData.name}
              onChange={(e) =>
                setModelData({ ...modelData, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter model name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fields</label>
            <div className="space-y-2">
              {modelData.fields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={field.name}
                    readOnly
                    className="flex-1 p-2 border rounded bg-gray-50"
                  />
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {field.type}
                  </span>
                  {field.validation && (
                    <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                      {field.validation}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded"
                  placeholder="Field name"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-32 p-2 border rounded"
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newField.defaultValue}
                  onChange={(e) =>
                    setNewField({ ...newField, defaultValue: e.target.value })
                  }
                  className="flex-1 p-2 border rounded"
                  placeholder="Default value"
                />
                <select
                  value={newField.validation}
                  onChange={(e) =>
                    setNewField({ ...newField, validation: e.target.value })
                  }
                  className="w-32 p-2 border rounded"
                >
                  <option value="">Validation</option>
                  {validationRules.map((rule) => (
                    <option key={rule} value={rule}>
                      {rule}
                    </option>
                  ))}
                </select>
              </div>

              {newField.type === "mapping" && (
                <input
                  type="text"
                  value={newField.mapping || ""}
                  onChange={(e) =>
                    setNewField({ ...newField, mapping: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="key:value,key2:value2"
                />
              )}

              {newField.validation &&
                [
                  "pattern",
                  "enum",
                  "min",
                  "max",
                  "minLength",
                  "maxLength",
                ].includes(newField.validation) && (
                  <div className="flex gap-2">
                    {newField.validation === "pattern" && (
                      <input
                        type="text"
                        value={newField.validationOptions?.pattern || ""}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            validationOptions: {
                              ...newField.validationOptions,
                              pattern: e.target.value,
                            },
                          })
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder="Regular expression pattern"
                      />
                    )}
                    {newField.validation === "enum" && (
                      <input
                        type="text"
                        value={
                          newField.validationOptions?.enum?.join(",") || ""
                        }
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            validationOptions: {
                              ...newField.validationOptions,
                              enum: e.target.value.split(","),
                            },
                          })
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder="Comma-separated values"
                      />
                    )}
                    {["min", "max", "minLength", "maxLength"].includes(
                      newField.validation
                    ) && (
                      <input
                        type="number"
                        value={
                          newField.validationOptions?.[
                            newField.validation as keyof typeof newField.validationOptions
                          ] || ""
                        }
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            validationOptions: {
                              ...newField.validationOptions,
                              [newField.validation]: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder={`Enter ${newField.validation} value`}
                      />
                    )}
                  </div>
                )}

              <button
                onClick={handleAddField}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>

              
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={createCrudApis}
                    onChange={(e) => setCreateCrudApis(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-sm">Create CRUD APIs</label>
                </div>
              
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
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
            {model ? "Update" : "Save"} Model
          </button>
        </div>
      </div>
    </div>
  );
}
