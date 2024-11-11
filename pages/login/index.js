import Cookies from 'js-cookie';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import Loader from '../../public/loaders/ButtonLoader';
import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase';
import { useRouter } from 'next/router';
import { authStatus } from '../../utils/authStatus';

const Login = () => {
  const [error, setError] = useState(false);
  const router = useRouter();
  const handleSSOWithCode = async () => {
    try {
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
        Cookies.set('session', res._tokenResponse.idToken, {
          sameSite: 'Strict',
        });
        console.log(res);
        const user = authStatus(res._tokenResponse.idToken);
        console.log(user);
        if (user && user.data.accountVerifiedByAview) router.push('/dashboard');
        else throw Error;
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  useEffect(() => {
    handleSSOWithCode();
  }, []);

  return (
    <div className="mt-s20 h-full w-full items-center justify-center">
      {!error ? (
        <div className="mx-auto">
          <Loader />
        </div>
      ) : (
        <p className="text-center text-3xl">
          You do not have access to the platform(yet)
        </p>
      )}
    </div>
  );
};

export default Login;
