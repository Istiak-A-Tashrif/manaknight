import { useFlowContext } from '../store/FlowContext';

const SomeComponent = () => {
  const { nodes, setNodes } = useFlowContext();

  // Example usage
  const addNode = () => {
    setNodes([...nodes, { id: 'new-node', data: {}, position: { x: 0, y: 0 } }]);
  };

  return (
    <div>
      <button onClick={addNode}>Add Node</button>
    </div>
  );
};

export default SomeComponent; 