import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
