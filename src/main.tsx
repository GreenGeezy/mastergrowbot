import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Improve initial load by moving root element check to top level
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

// Remove StrictMode in production to avoid double-rendering
const isDev = import.meta.env.DEV
const AppWrapper = isDev ? StrictMode : React.Fragment

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
)