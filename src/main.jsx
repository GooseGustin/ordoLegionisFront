import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import '../../../../resources/bootstrap-5.2.0-beta1/dist/css/bootstrap.css'
import '../../../../resources/fontawesome-6.7.1/css/fontawesome.min.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
