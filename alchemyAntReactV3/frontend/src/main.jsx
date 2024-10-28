import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './pages/Index.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)