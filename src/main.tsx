import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './three/setup'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
