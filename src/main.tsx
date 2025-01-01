import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Error boundary for better error handling
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Reload page
      </button>
    </div>
  </div>
);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Rendering error:', error);
  root.render(<ErrorFallback />);
}