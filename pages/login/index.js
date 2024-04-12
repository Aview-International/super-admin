import Cookies from 'js-cookie';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import Loader from '../../public/loaders/ButtonLoader';
import { useEffect } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import { firebaseAuth } from '../../services/firebase';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const handleSSOWithCode = async () => {
    try {
      const auth = firebaseAuth;
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email)
          email = window.prompt('Please provide your email for confirmation');

        const res = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        window.localStorage.removeItem('emailForSignIn');
        Cookies.set('session', res._tokenResponse.idToken);
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
      ErrorHandler(null, 'Something went wrong, please try again');
    }
  };

  useEffect(() => {
    handleSSOWithCode();
  }, []);

  return (
    <div className="mt-s20 flex h-full w-full items-center justify-center">
      <Loader />
    </div>
  );
};

export default Login;
