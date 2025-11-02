import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #f59e0b',
                        borderRadius: '12px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#f59e0b',
                            secondary: '#1e293b',
                        },
                    },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>,
)