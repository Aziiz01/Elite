import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShopContextProvider from './context/ShopContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <HelmetProvider>
      <BrowserRouter>
        <ShopContextProvider>
          <ToastContainer />
          <App />
        </ShopContextProvider>
      </BrowserRouter>
    </HelmetProvider>
  </ErrorBoundary>,
)
