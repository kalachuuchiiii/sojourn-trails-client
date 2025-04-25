
import { createRoot } from 'react-dom/client'
import './index.css'
import store from './state/store.js'; 
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store = {store}>
              <App />
    </Provider>
  </BrowserRouter>
)
