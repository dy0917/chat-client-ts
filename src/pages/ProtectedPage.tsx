import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { clearToken, loginWithTokenAsync } from '../store/slices/auth';
import { useEffect } from 'react';

// wrap around logged-in user only routes to protect them
function ProtectedPage() {
  const { me, status, error, token } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
    useEffect(() => { 
        if (token) {
            dispatch(loginWithTokenAsync({}));
          }
    },[])
    useEffect(() => {
        if ((error && status == 'failed') || !token) {
      dispatch(clearToken());
      navigate('/');
      return;
    }
  }, [status, error]);

  return !error && status == 'succeeded' ? (
    <Outlet />
  ) : (
    <div>
              Loading...
    </div>
  );
}
export default ProtectedPage;
