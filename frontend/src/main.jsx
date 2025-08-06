import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoreContextProvider } from './store/StoreContext.jsx'
import { AuthProvider } from './store/AuthContext.jsx'
import { SocketProvider } from './store/Socket.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <AuthProvider>
        <SocketProvider>
         <App />
        </SocketProvider>
      </AuthProvider>
    </StoreContextProvider>
  </BrowserRouter>
)
