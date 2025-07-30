import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 bg-white" />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;