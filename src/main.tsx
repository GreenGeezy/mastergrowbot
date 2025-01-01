import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Optimize initial load by checking root element early
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

// Disable StrictMode in production to prevent double-rendering
const isDev = import.meta.env.DEV

// Render app with optimized settings
root.render(
  isDev ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
)