import { create } from "zustand";
import { Node, Edge } from "reactflow";

interface Model {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    defaultValue: string;
    validation: string;
    mapping?: string;
  }[];
}

interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: {
    authRequired: boolean;
    routes: string[];
    canCreateUsers?: boolean;
    canEditUsers?: boolean;
    canDeleteUsers?: boolean;
    canManageRoles?: boolean;
  };
}

interface Route {
  id: string;
  name: string;
  method: string;
  url: string;
  flowData?: {
    nodes: any[];
    edges: any[];
  };
}

interface Settings {
  globalKey: string;
  databaseType: string;
  authType: string;
  timezone: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  models: Model[];
  roles: Role[];
  routes: Route[];
  settings: Settings;
  defaultTablesShown: boolean;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setSelectedNode: (node: Node | null) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  addModel: (model: Model) => void;
  updateModel: (model: Model) => void;
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (roleId: string) => void;
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (routeId: string) => void;
  updateSettings: (settings: Settings) => void;
  setDefaultTablesShown: (shown: boolean) => void;
  updateNode: (nodeId: string, newData: any) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  models: [],
  roles: [],
  routes: [],
  settings: {
    globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    databaseType: "mysql",
    authType: "session",
    timezone: "UTC",
    dbHost: "localhost",
    dbPort: "3306", // normal MySQL port
    dbUser: "root",
    dbPassword: "root",
    dbName: `database_${new Date().toISOString().split("T")[0]}`, // today's date
  },
  defaultTablesShown: false,
  setNodes: (nodes) =>
    set((state) => ({
      nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
    })),
  setEdges: (edges) =>
    set((state) => ({
      edges: typeof edges === "function" ? edges(state.edges) : edges,
    })),
  setSelectedNode: (node) => set({ selectedNode: node }),
  updateNodeData: (nodeId, newData) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    })),
  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),
  updateModel: (model) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === model.id ? model : m)),
    })),
  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, role],
    })),
  updateRole: (role) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === role.id ? role : r)),
    })),
  deleteRole: (roleId) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== roleId),
    })),
  addRoute: (route) =>
    set((state) => ({
      routes: [...state.routes, route],
    })),
  updateRoute: (route) =>
    set((state) => ({
      routes: state.routes.map((r) => (r.id === route.id ? route : r)),
    })),
  deleteRoute: (routeId) =>
    set((state) => ({
      routes: state.routes.filter((r) => r.id !== routeId),
    })),
  updateSettings: (settings) => set({ settings }),
  setDefaultTablesShown: (shown) => set({ defaultTablesShown: shown }),
  updateNode: (nodeId: string, newData: any) => {
    console.log("Updating node in store:", nodeId, newData);
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      ),
    }));
  },
}));
