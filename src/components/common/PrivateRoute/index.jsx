import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axios } from '~/apis';
import { AUTH_KEY } from '~/app/constants';
import { loginSuccess } from '~/features/Auth/authSlice';
import { getLocalStorage, removeLocalStorage } from '~/utils';

const PrivateRoute = ({ role, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log({ role });

  useEffect(() => {
    (async () => {
      try {
        var { refreshToken } = getLocalStorage(AUTH_KEY) || {};

        if (!refreshToken) return navigate('/login');

        var res = await axios.post('/getProfile', { refreshToken });
        if (!res.user) {
          removeLocalStorage(AUTH_KEY);
          return navigate('/login');
        }
        dispatch(loginSuccess({ ...res.user, role: res.role }));
      } catch (error) {
        removeLocalStorage(AUTH_KEY);
      }
    })();
  }, []);
  return children;
};

export default PrivateRoute;
