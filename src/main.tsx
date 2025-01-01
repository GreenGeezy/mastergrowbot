import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

const isDev = import.meta.env.DEV

root.render(
  isDev ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
)