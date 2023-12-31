import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './router.js';
import store from './store/index.js';
import { SocketProvider } from './store/socketContext.js';
import ToastManagementContainer from './components/ToastManagementContainer.js';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <ToastManagementContainer/>
        <AppRoutes />
      </BrowserRouter>
    </SocketProvider>
  </Provider>
);
