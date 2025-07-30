import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FlowProvider } from './store/FlowContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <FlowProvider>
      <App />
    </FlowProvider>
  </React.StrictMode>
); 