import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AppRoute from './pages/App';
import ChatPage from './pages/ChatPage';
import PageNotFound from './pages/PageNotFound';
import ProtectedPage from './pages/ProtectedPage';
import { TopNavbar } from './components/navbar';
import { ChatBoard } from './components/ChatBoard';

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route element={<ProtectedPage />}>
        <Route element={<TopNavbar />}>
          <Route path="/chat" element={<ChatPage />}>
            <Route path=":roomId" element={<ChatBoard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />

      {/* index matches on default/home URL: / */}
      {/* <Route index element={<App {...props} />} />
      <Route path="jennet" element={<Jennetpage {...props} />} />
      <Route path="calculator" element={<Calculator {...props} />} />
      <Route path="activityFinder" element={<ActivityFinder {...props} />} />
      <Route path="MUIDemo" element={<MUIDemo />}></Route>
      <Route
        path="dashboard"
        element={<ProtectedRoute redirectPath={'/jennet'} />}
      >
        <Route index element={<DashboardPage {...props} />} />
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="tasks" element={<DashboardTasks />} />
      </Route>

      <Route path="todo" element={<ReduxTodoList {...props} />} />
      <Route path="/subscribe" element={<SubscribeForm {...props} />}></Route>
      <Route path="/posts" element={<PostsPage {...props} />}>
        <Route index element={<PostList />} />
    
        <Route path=":id" element={<Post />} />
      </Route>
      <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}

export default AppRoutes;
