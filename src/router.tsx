import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import PageNotFound from './pages/PageNotFound';
import ProtectedPage from './pages/ProtectedPage';
import { TopNavbar } from './components/navbar';
import { ChatBoard } from './components/ChatBoard';

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path='/signup' element={<RegisterPage />} />
      <Route element={<ProtectedPage />}>
        <Route element={<TopNavbar />}>
          <Route path="/chat" element={<ChatPage />}>
            <Route path=":roomId" element={<ChatBoard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;
