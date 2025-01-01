import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Enhanced error boundary for better error handling and debugging
const ErrorFallback = ({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center p-6 bg-black/40 rounded-lg backdrop-blur-sm border border-primary/20">
      <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
      {error && (
        <pre className="mt-2 text-sm text-gray-400 overflow-auto max-w-md">
          {error.message}
        </pre>
      )}
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
  root.render(<ErrorFallback error={error as Error} />);
}