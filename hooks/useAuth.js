import Cookies from 'js-cookie';
import { authStatus } from '../utils/authStatus';

const useAuth = () => {
  const token = Cookies.get('token');
  const auth = authStatus(token);
  return auth;
};

export default useAuth;
