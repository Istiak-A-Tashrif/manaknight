import { createContext, ReactNode, useContext, useReducer, useMemo } from 'react';
import { Edge, Node } from 'reactflow';

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

type FlowAction =
  | { type: 'SET_NODES'; payload: Node[] | ((prev: Node[]) => Node[]) }
  | { type: 'SET_EDGES'; payload: Edge[] | ((prev: Edge[]) => Edge[]) }
  | { type: 'SET_SELECTED_NODE'; payload: Node | null }
  | { type: 'UPDATE_NODE_DATA'; payload: { nodeId: string; newData: any } }
  | { type: 'ADD_MODEL'; payload: Model }
  | { type: 'UPDATE_MODEL'; payload: Model }
  | { type: 'ADD_ROLE'; payload: Role }
  | { type: 'UPDATE_ROLE'; payload: Role }
  | { type: 'DELETE_ROLE'; payload: string }
  | { type: 'ADD_ROUTE'; payload: Route }
  | { type: 'UPDATE_ROUTE'; payload: Route }
  | { type: 'DELETE_ROUTE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Settings }
  | { type: 'SET_DEFAULT_TABLES_SHOWN'; payload: boolean };
  
const initialState = {
  nodes: [] as Node[],
  edges: [] as Edge[],
  selectedNode: null as Node | null,
  models: [] as Model[],
  roles: [] as Role[],
  routes: [] as Route[],
  settings: {
    globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    databaseType: "mysql",
    authType: "session",
    timezone: "UTC",
    dbHost: "localhost",
    dbPort: "3306",
    dbUser: "root",
    dbPassword: "root",
    dbName: `database_${new Date().toISOString().split("T")[0]}`,
  } as Settings,
  defaultTablesShown: false,
};

type FlowStateType = typeof initialState;

// Reducer function
const flowReducer = (state: FlowStateType, action: FlowAction): FlowStateType => {
  switch (action.type) {
    case 'SET_NODES':
      return {
        ...state,
        nodes: typeof action.payload === 'function' ? action.payload(state.nodes) : action.payload,
      };
    case 'SET_EDGES':
      return {
        ...state,
        edges: typeof action.payload === 'function' ? action.payload(state.edges) : action.payload,
      };
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload };
    case 'UPDATE_NODE_DATA':
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? { ...node, data: { ...node.data, ...action.payload.newData } }
            : node
        ),
      };
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] };
    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map((m) => (m.id === action.payload.id ? action.payload : m)),
      };
    case 'ADD_ROLE':
      return { ...state, roles: [...state.roles, action.payload] };
    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map((r) => (r.id === action.payload.id ? action.payload : r)),
      };
    case 'DELETE_ROLE':
      return { ...state, roles: state.roles.filter((r) => r.id !== action.payload) };
    case 'ADD_ROUTE':
      return { ...state, routes: [...state.routes, action.payload] };
    case 'UPDATE_ROUTE':
      return {
        ...state,
        routes: state.routes.map((r) => (r.id === action.payload.id ? action.payload : r)),
      };
    case 'DELETE_ROUTE':
      return { ...state, routes: state.routes.filter((r) => r.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_DEFAULT_TABLES_SHOWN':
      return { ...state, defaultTablesShown: action.payload };
    default:
      return state;
  }
};

interface FlowState extends FlowStateType {
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
}

const FlowContext = createContext<FlowState | undefined>(undefined);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  const actions = useMemo(
    () => ({
      setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) =>
        dispatch({ type: 'SET_NODES', payload: nodes }),
      setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) =>
        dispatch({ type: 'SET_EDGES', payload: edges }),
      setSelectedNode: (node: Node | null) =>
        dispatch({ type: 'SET_SELECTED_NODE', payload: node }),
      updateNodeData: (nodeId: string, newData: any) =>
        dispatch({ type: 'UPDATE_NODE_DATA', payload: { nodeId, newData } }),
      addModel: (model: Model) =>
        dispatch({ type: 'ADD_MODEL', payload: model }),
      updateModel: (model: Model) =>
        dispatch({ type: 'UPDATE_MODEL', payload: model }),
      addRole: (role: Role) =>
        dispatch({ type: 'ADD_ROLE', payload: role }),
      updateRole: (role: Role) =>
        dispatch({ type: 'UPDATE_ROLE', payload: role }),
      deleteRole: (roleId: string) =>
        dispatch({ type: 'DELETE_ROLE', payload: roleId }),
      addRoute: (route: Route) =>
        dispatch({ type: 'ADD_ROUTE', payload: route }),
      updateRoute: (route: Route) =>
        dispatch({ type: 'UPDATE_ROUTE', payload: route }),
      deleteRoute: (routeId: string) =>
        dispatch({ type: 'DELETE_ROUTE', payload: routeId }),
      updateSettings: (settings: Settings) =>
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
      setDefaultTablesShown: (shown: boolean) =>
        dispatch({ type: 'SET_DEFAULT_TABLES_SHOWN', payload: shown }),
    }),
    []
  );

  const contextValue: FlowState = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );

  return (
    <FlowContext.Provider value={contextValue}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within a FlowProvider");
  }
  return context;
}; 