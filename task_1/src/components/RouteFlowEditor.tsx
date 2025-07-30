import { ArrowLeft, Save } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  ReactFlowProvider,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowContext } from "../store/FlowContext";
import { ComponentsPanel } from "./ComponentsPanel";
import { ConfigPanel } from "./ConfigPanel";
import CustomNode from "./CustomNode";

const nodeTypes = {
  auth: CustomNode,
  url: CustomNode,
  output: CustomNode,
  logic: CustomNode,
  variable: CustomNode,
  "db-find": CustomNode,
  "db-insert": CustomNode,
  "db-update": CustomNode,
  "db-delete": CustomNode,
  "db-query": CustomNode,
};

interface FlowEditorContentProps {
  route: any;
  onClose: () => void;
}

function FlowEditorContent({ route, onClose }: FlowEditorContentProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  const {
    updateRoute,
  } = useFlowContext();

  // Local state for this route's flow data
  const [localNodes, setLocalNodes] = useState<any[]>([]);
  const [localEdges, setLocalEdges] = useState<any[]>([]);
  const [localSelectedNode, setLocalSelectedNode] = useState<any>(null);

  // Refs to keep track of latest state for cleanup
  const latestNodesRef = useRef<any[]>([]);
  const latestEdgesRef = useRef<any[]>([]);

  // Update refs whenever state changes
  useEffect(() => {
    latestNodesRef.current = localNodes;
  }, [localNodes]);

  useEffect(() => {
    latestEdgesRef.current = localEdges;
  }, [localEdges]);

  // Local updateNodeData function
  const updateLocalNodeData = useCallback((nodeId: string, newData: any) => {
    setLocalNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, []);

  useEffect(() => {
    // Load saved flow data if it exists
    if (route.flowData) {
      setLocalNodes(route.flowData.nodes);
      setLocalEdges(route.flowData.edges);
    } else {
      // Create default URL node for new routes
      const defaultNode = {
        id: `node_${Date.now()}`,
        type: "url",
        position: { x: 100, y: 100 },
        data: {
          label: "URL",
          path: route.url,
          method: route.method,
        },
      };
      setLocalNodes([defaultNode]);
      setLocalEdges([]);
    }
  }, [route]);

  // Debounced auto-save - save changes after 1 second of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNodes.length > 0 || localEdges.length > 0) {
        updateRoute({
          ...route,
          flowData: {
            nodes: localNodes,
            edges: localEdges,
          },
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localNodes, localEdges, route, updateRoute]);

  // Save state when component unmounts
  useEffect(() => {
    return () => {
      const nodes = latestNodesRef.current;
      const edges = latestEdgesRef.current;
      if (nodes.length > 0 || edges.length > 0) {
        updateRoute({
          ...route,
          flowData: {
            nodes,
            edges,
          },
        });
      }
    };
  }, [route, updateRoute]);

  const onNodesChange = useCallback(
    (changes: import("reactflow").NodeChange[]) => setLocalNodes((nds) => applyNodeChanges(changes, nds)),
    [setLocalNodes]
  );

  const onEdgesChange = useCallback(
    (changes: import("reactflow").EdgeChange[]) => setLocalEdges((eds) => applyEdgeChanges(changes, eds)),
    [setLocalEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setLocalEdges((eds) => addEdge(params, eds)),
    [setLocalEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " "),
        },
      };

      setLocalNodes((nds) => [...nds, newNode]);
    },
    [project, setLocalNodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setLocalSelectedNode(node);
    },
    [setLocalSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setLocalSelectedNode(null);
  }, [setLocalSelectedNode]);

  const handleSave = () => {
    updateRoute({
      ...route,
      flowData: {
        nodes: localNodes,
        edges: localEdges,
      },
    });
    onClose();
  };

  const handleClose = () => {
    // Save current state before closing
    updateRoute({
      ...route,
      flowData: {
        nodes: localNodes,
        edges: localEdges,
      },
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Routes
          </button>
          <h2 className="ml-4 text-lg font-semibold">
            {route.name} ({route.method} {route.url})
          </h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ComponentsPanel />
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={localNodes}
            edges={localEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Control"
            selectionKeyCode="Shift"
            snapToGrid={true}
            snapGrid={[15, 15]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        {localSelectedNode && (
          <ConfigPanel
            node={localSelectedNode}
            onClose={() => setLocalSelectedNode(null)}
            onUpdateNode={updateLocalNodeData}
          />
        )}
      </div>
    </div>
  );
}

export function RouteFlowEditor({ route, onClose }: FlowEditorContentProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorContent route={route} onClose={onClose} />
    </ReactFlowProvider>
  );
}
