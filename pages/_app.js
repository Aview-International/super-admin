import { useEffect } from 'react';
import UserContextProvider from '../store/user-profile';

import { MenuOpenContextProvider } from '../store/menu-open-context';

import '../styles/globals.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <MenuOpenContextProvider>
      <UserContextProvider>
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
      </UserContextProvider>
    </MenuOpenContextProvider>
  );
};

const Layout = ({ Component, pageProps }) => {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
