import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axios } from '~/apis';
import { AUTH_KEY } from '~/app/constants';
import { loginSuccess } from '~/features/Auth/authSlice';
import { getLocalStorage } from '~/utils';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      var { refreshToken } = getLocalStorage(AUTH_KEY) || {};

      if (!refreshToken) return navigate('/login');

      var res = await axios.post('/getProfile', { refreshToken });
      if (!res.user) {
        return navigate('/login');
      }
      dispatch(loginSuccess({ ...res.user, role: res.role }));
    })();
  }, []);
  return children;
};

export default PrivateRoute;
