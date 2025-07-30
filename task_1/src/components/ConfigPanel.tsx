import { Plus, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Node } from "reactflow";
import { useFlowContext } from "../store/FlowContext";

interface ConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (id: string, data: any) => void;
}

interface Field {
  name: string;
  type: string;
  validation?: string;
}

const getDefaultDataForType = (type: string) => {
  const baseData = {
    label: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " "),
  };

  switch (type) {
    case "variable":
      return {
        ...baseData,
        name: "",
        type: "string",
        defaultValue: "",
      };

    case "url":
      return {
        ...baseData,
        method: "GET",
        path: "",
        fields: [],
        queryFields: [],
      };

    case "auth":
      return {
        ...baseData,
        authType: "bearer",
        tokenVar: "",
      };

    case "output":
      return {
        ...baseData,
        outputType: "definition",
        statusCode: 200,
        fields: [],
        responseRaw: "",
      };

    case "logic":
      return {
        ...baseData,
        code: "",
      };

    case "db-find":
    case "db-query":
      return {
        ...baseData,
        model: "",
        operation: "findMany",
        query: "",
        resultVar: "result",
      };

    case "db-insert":
      return {
        ...baseData,
        model: "",
        variables: "",
        resultVar: "result",
      };

    case "db-update":
    case "db-delete":
      return {
        ...baseData,
        model: "",
        idField: "id",
        variables: "",
        resultVar: "result",
      };

    default:
      return baseData;
  }
};

export function ConfigPanel({ node, onClose, onUpdateNode }: ConfigPanelProps) {
  const { models } = useFlowContext();
  const [bodyField, setBodyField] = useState<Field>({
    name: "",
    type: "string",
  });
  const [queryField, setQueryField] = useState<Field>({
    name: "",
    type: "string",
  });

  // Create a local copy of node data that we can track for changes
  const [localNodeData, setLocalNodeData] = useState(node?.data || {});

  // Update local data when node changes (but not when we update it ourselves)
  useEffect(() => {
    if (node?.data) {
      setLocalNodeData(node.data);
    }
  }, [node?.data]);

  useEffect(() => {
    if (node && node.type) {
      // Initialize node data with defaults if not already set
      const defaultData = getDefaultDataForType(node.type);
      const newData = {
        ...defaultData,
        ...node.data, // This will override defaults with any existing data
      };

      // Only update if the data is different
      if (JSON.stringify(newData) !== JSON.stringify(node.data)) {
        onUpdateNode(node.id, newData);
        setLocalNodeData(newData);
      }
    }
  }, [node?.id, node?.type]);

  if (!node) return null;
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!node) return;

    const newData = {
      ...localNodeData,
      [e.target.name]: e.target.value,
    };

    onUpdateNode(node.id, newData);
    setLocalNodeData(newData);
  };

  const handleArrayChange = (
    index: number,
    field: string,
    value: string,
    arrayName: string
  ) => {
    const array = [...(localNodeData[arrayName] || [])];
    array[index] = { ...array[index], [field]: value };
    const newData = {
      ...localNodeData,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    setLocalNodeData(newData);
  };

  const addField = (arrayName: string) => {
    const fieldToAdd = arrayName === "queryFields" ? queryField : bodyField;
    if (!fieldToAdd.name.trim()) return;

    const array = [...(localNodeData[arrayName] || []), { ...fieldToAdd }];
    const newData = {
      ...localNodeData,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    setLocalNodeData(newData);

    // Reset the appropriate state
    if (arrayName === "queryFields") {
      setQueryField({ name: "", type: "string" });
    } else {
      setBodyField({ name: "", type: "string" });
    }
  };

  const removeField = (index: number, arrayName: string) => {
    const array = [...(localNodeData[arrayName] || [])];
    array.splice(index, 1);
    const newData = {
      ...localNodeData,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    setLocalNodeData(newData);
  };

  const copyQueryFields = () => {
    const currentFields = localNodeData.fields || [];
    navigator.clipboard.writeText(JSON.stringify(currentFields, null, 2));
  };

  const renderDatabaseFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          name="model"
          value={localNodeData.model || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model.id} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Operation</label>
        <select
          name="operation"
          value={localNodeData.operation || "findMany"}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="findMany">Find Many</option>
          <option value="findOne">Find One</option>
          <option value="findFirst">Find First</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">SQL Query</label>
        <textarea
          name="query"
          value={localNodeData.query || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 font-mono text-sm"
          placeholder="SELECT * FROM table WHERE id = :id"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Save Result In</label>
        <input
          type="text"
          name="resultVar"
          value={localNodeData.resultVar || "result"}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="result"
        />
      </div>
    </>
  );

  const renderFields = () => {
    switch (node.type) {
      case "auth":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Auth Type
              </label>
              <select
                name="authType"
                value={localNodeData.authType || "bearer"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="jwt">JWT</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Token Variable
              </label>
              <input
                type="text"
                name="tokenVar"
                value={localNodeData.tokenVar || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="token"
              />
            </div>
          </>
        );

      case "url":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                name="method"
                value={localNodeData.method || "GET"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Route Path
              </label>
              <input
                type="text"
                name="path"
                value={localNodeData.path || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="/api/users/:id"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Body Fields
              </label>
              {localNodeData.fields?.length > 0 && (
                <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                  {localNodeData.fields.map((field: Field) => (
                    <div key={field.name} className="text-gray-600">
                      {field.name}: {field.type}
                      {field.validation ? ` (${field.validation})` : ""}
                    </div>
                  ))}
                </div>
              )}
              {(localNodeData.fields || []).map(
                (field: Field, index: number) => (
                  <div key={index} className="flex gap-1 mb-2">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "name",
                          e.target.value,
                          "fields"
                        )
                      }
                      className="flex-1 p-2 border rounded text-sm"
                      placeholder="Field name"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "type",
                          e.target.value,
                          "fields"
                        )
                      }
                      className="w-20 p-2 border rounded text-sm"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Bool</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      onClick={() => removeField(index, "fields")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )
              )}
              <div className="flex gap-1 mt-2">
                <input
                  type="text"
                  value={bodyField.name}
                  onChange={(e) =>
                    setBodyField({ ...bodyField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="New field name"
                />
                <select
                  value={bodyField.type}
                  onChange={(e) =>
                    setBodyField({ ...bodyField, type: e.target.value })
                  }
                  className="w-20 p-2 border rounded text-sm"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Bool</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => {
                    if (bodyField.name.trim()) {
                      addField("fields");
                    }
                  }}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Query Parameters
              </label>
              {localNodeData.queryFields?.length > 0 && (
                <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                  {localNodeData.queryFields.map((field: Field) => (
                    <div key={field.name} className="text-gray-600">
                      {field.name}: {field.type}
                      {field.validation ? ` (${field.validation})` : ""}
                    </div>
                  ))}
                </div>
              )}
              {(localNodeData.queryFields || []).map(
                (field: Field, index: number) => (
                  <div key={index} className="flex gap-1 mb-2">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "name",
                          e.target.value,
                          "queryFields"
                        )
                      }
                      className="flex-1 p-2 border rounded text-sm"
                      placeholder="Field name"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "type",
                          e.target.value,
                          "queryFields"
                        )
                      }
                      className="w-20 p-2 border rounded text-sm"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Bool</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      onClick={() => removeField(index, "queryFields")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )
              )}
              <div className="flex gap-1 mt-2">
                <input
                  type="text"
                  value={queryField.name}
                  onChange={(e) =>
                    setQueryField({ ...queryField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="New query param"
                />
                <select
                  value={queryField.type}
                  onChange={(e) =>
                    setQueryField({ ...queryField, type: e.target.value })
                  }
                  className="w-20 p-2 border rounded text-sm"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Bool</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => {
                    if (queryField.name.trim()) {
                      addField("queryFields");
                    }
                  }}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        );

      case "output":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Output Type
              </label>
              <select
                name="outputType"
                value={localNodeData.outputType || "definition"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="definition">Definition</option>
                <option value="mockup">Mockup</option>
              </select>
            </div>

            {(localNodeData.outputType || "definition") === "mockup" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Response Raw
                </label>
                <textarea
                  name="responseRaw"
                  value={localNodeData.responseRaw || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Enter raw response here..."
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fields</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(localNodeData.fields || []).map(
                    (field: Field, index: number) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "name",
                              e.target.value,
                              "fields"
                            )
                          }
                          className="flex-1 p-2 border rounded text-sm"
                          placeholder="Field name"
                        />
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "type",
                              e.target.value,
                              "fields"
                            )
                          }
                          className="w-24 p-2 border rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="object">Object</option>
                          <option value="array">Array</option>
                        </select>
                        <button
                          onClick={() => removeField(index, "fields")}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={bodyField.name}
                    onChange={(e) =>
                      setBodyField({ ...bodyField, name: e.target.value })
                    }
                    className="flex-1 p-2 border rounded text-sm"
                    placeholder="New field name"
                  />
                  <select
                    value={bodyField.type}
                    onChange={(e) =>
                      setBodyField({ ...bodyField, type: e.target.value })
                    }
                    className="w-24 p-2 border rounded text-sm"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                  </select>
                  <button
                    onClick={() => {
                      if (bodyField.name.trim()) {
                        addField("fields");
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Status Code
              </label>
              <input
                type="number"
                name="statusCode"
                value={localNodeData.statusCode || 200}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="200"
              />
            </div>
          </>
        );

      case "variable":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Variable Name
              </label>
              <input
                type="text"
                name="name"
                value={localNodeData.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="myVariable"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={localNodeData.type || "string"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Default Value
              </label>
              <input
                type="text"
                name="defaultValue"
                value={localNodeData.defaultValue || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Default value"
              />
            </div>
          </>
        );

      case "logic":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              JavaScript Code
            </label>
            <textarea
              name="code"
              value={localNodeData.code || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded h-40 font-mono text-sm"
              placeholder="// Write your JavaScript code here"
            />
          </div>
        );

      case "db-find":
        return renderDatabaseFields();

      case "db-query":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <button
                onClick={copyQueryFields}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Copy Fields
              </button>
            </div>
          </>
        );

      case "db-insert":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Variables
              </label>
              <textarea
                name="variables"
                value={localNodeData.variables || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded h-20 font-mono text-sm"
                placeholder="name: string&#10;age: number"
              />
            </div>
          </>
        );

      case "db-update":
      case "db-delete":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ID Field</label>
              <input
                type="text"
                name="idField"
                value={localNodeData.idField || "id"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="id"
              />
            </div>
            {node.type === "db-update" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Variables
                </label>
                <textarea
                  name="variables"
                  value={localNodeData.variables || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-20 font-mono text-sm"
                  placeholder="name: string&#10;age: number"
                />
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      key={node.id}
      className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 p-4 shadow-lg transform transition-transform overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Configure Node</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      {renderFields()}
    </div>
  );
}
