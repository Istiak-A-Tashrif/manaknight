import React from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls
} from 'reactflow';
import { useFlowContext } from '../store/FlowContext';
import { ConfigPanel } from './ConfigPanel';
import CustomNode from './CustomNode';

const nodeTypes = {
  auth: CustomNode,
  url: CustomNode,
  output: CustomNode,
  logic: CustomNode,
  variable: CustomNode,
  'db-find': CustomNode,
  'db-insert': CustomNode,
  'db-update': CustomNode,
  'db-delete': CustomNode,
  'db-query': CustomNode,
};

export function FlowEditor() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNode,
    setSelectedNode,
    updateNodeData,
  } = useFlowContext();

  const onNodesChange = React.useCallback(
    (changes: import('reactflow').NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = React.useCallback(
    (changes: import('reactflow').EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = React.useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = React.useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <ConfigPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={updateNodeData}
      />
    </div>
  );
}