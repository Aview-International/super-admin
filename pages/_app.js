import '../styles/globals.css';
import '../styles/fonts.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { auth, logoutUser } from '../services/firebase';
import Cookies from 'js-cookie';
import { setUser } from '../store/reducers/user.reducer';
import {
  getCountriesAndCodes,
  getSupportedLanguages,
  getTranslatorFromUserId,
} from '../services/apis';
import {
  setCountriesAndCodes,
  setSupportedLanguages,
} from '../store/reducers/languages.reducer';

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    const setViewportHeight = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.onresize = setViewportHeight;
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Layout Component={Component} pageProps={pageProps} />
    </Provider>
  );
};

const Layout = ({ Component, pageProps }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          Cookies.set('uid', user.uid, { sameSite: 'Strict' });
          const userData = await getTranslatorFromUserId();
          dispatch(
            setUser({
              ...userData,
              isLoggedIn: true,
              isAuthChecking: false,
            })
          );
        } else {
          logoutUser();
        }
      } catch (error) {
        logoutUser();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const lang = await getSupportedLanguages();
        dispatch(setSupportedLanguages(lang));

        const countries = await getCountriesAndCodes();
        dispatch(setCountriesAndCodes(countries));
      } catch (error) {}
    })();
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
