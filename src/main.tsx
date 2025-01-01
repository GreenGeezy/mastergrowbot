import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Immediately start loading the app
const startApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Failed to find the root element');

  const root = createRoot(rootElement);
  root.render(<App />);
};

// Execute immediately
startApp();