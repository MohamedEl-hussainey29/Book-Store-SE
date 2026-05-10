import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AuthContextProvider from './Contexts/AuthContext.tsx';
import { store } from './redux/store.tsx'
import { Provider } from 'react-redux'


createRoot(document.getElementById('root')!).render(
  
    <AuthContextProvider>
      <Provider store={store} >
        <App />
      </Provider>
    </AuthContextProvider>
  
)
