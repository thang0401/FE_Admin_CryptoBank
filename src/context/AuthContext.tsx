// AuthProvider.tsx
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import authConfig from 'src/configs/auth';
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types';

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!;
      if (storedToken) {
        setLoading(true);
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken,
            },
          })
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data.userData });
          })
          .catch(() => {
            localStorage.removeItem('userData');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            setUser(null);
            setLoading(false);
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login');
            }
          });
      } else {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async (response) => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null;

        const userData = response.data.userData;
        setUser(userData);
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userData)) : null;

        let redirectURL = '/';
        if (!userData.isChangePass) {
          redirectURL = '/change-pass';
        } else {
          switch (userData.role) {
            case 'ADMIN':
              redirectURL = '/report-and-statistic/transaction-flow';
              break;
            case 'EMPLOYEE_BUYS_USDC':
              redirectURL = '/usdc-orders-management/buy-orders';
              break;
            case 'EMPLOYEE_SELLS_USDC':
              redirectURL = '/usdc-orders-management/sell-orders';
              break;
            case 'EMPLOYEE':
              redirectURL = '/customer-management';
              break;
            case 'HR':
              redirectURL = '/employee-management';
              break;
            default:
              redirectURL = '/';
          }
        }

        const returnUrl = router.query.returnUrl;
        // Xử lý returnUrl để đảm bảo nó là string
        const returnUrlString = Array.isArray(returnUrl) ? returnUrl[0] : returnUrl;
        redirectURL = returnUrlString && returnUrlString !== '/' ? returnUrlString : redirectURL;

        router.replace(redirectURL);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push('/login');
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
