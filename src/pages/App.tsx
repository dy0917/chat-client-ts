import { Outlet } from 'react-router-dom';
import { useSocketContext } from '../store/socketContext';

// wrap around logged-in user only routes to protect them
function AppRoute() {
  const socketContext = useSocketContext();

  // works for both nested and standalone routes
  return socketContext.socket?.id ? <div>Loading...</div> : <Outlet />;
}
export default AppRoute;
