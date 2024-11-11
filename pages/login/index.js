import Cookies from 'js-cookie';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import Loader from '../../public/loaders/ButtonLoader';
import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase';
import { useRouter } from 'next/router';
import { authStatus } from '../../utils/authStatus';
import Link from 'next/link';

const AUTH_ERRORS = {
  400: 'You do not have permission to access this platform (yet)',
  404: 'You do not have an account, please sign up',
  410: 'Your account is not approved yet, please contact an administrator',
};

const Login = () => {
  const [error, setError] = useState(undefined);
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
        // if account is new, first start from onboarding
        if (res._tokenResponse.isNewUser) return setError(404);
        const user = authStatus(res._tokenResponse.idToken);
        // if account is not verified by us, contact admin
        if (!user.data.accountVerifiedByAview) return setError(410);
        Cookies.set('session', res._tokenResponse.idToken, {
          sameSite: 'Strict',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      setError(undefined);
    } finally {
      window.localStorage.removeItem('emailForSignIn');
    }
  };

  useEffect(() => {
    handleSSOWithCode();
  }, []);

  return (
    <div className="mt-s20 h-full w-full text-center text-3xl">
      {!error ? (
        <div className="mx-auto">
          <Loader />
        </div>
      ) : (
        <p className="text-center text-3xl">
          {!error
            ? 'You do not have access to the platform(yet)'
            : AUTH_ERRORS[error]}
        </p>
      )}
      <br />

      {error === 404 && (
        <Link href="/onboarding">
          <a className="text-blue underline">Get started here</a>
        </Link>
      )}
    </div>
  );
};

export default Login;
