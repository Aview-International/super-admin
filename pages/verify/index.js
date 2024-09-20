import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Cookies from 'js-cookie';
import { verifyTranslatorEmail } from '../../services/apis';

const VerifyEmail = () => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { query } = router;
    if (query.apiKey && query.oobCode && query.mode === 'signIn')
      handleSSOWithCode();
  }, [router.query]);

  const handleSSOWithCode = () => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email)
          email = window.prompt('Please provide your email for confirmation');

        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem('emailForSignIn');
            Cookies.set('session', result._tokenResponse.idToken, {
              sameSite: 'Strict',
            });
            await verifyTranslatorEmail();

            router.replace('/success');
          })
          .catch(() => {
            setIsError(true);
          });
      }
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <div className="h-screen w-screen bg-black">
      <p className="pt-s4 pl-s4 text-xl text-white">
        {isError ? 'Something went wrong, invalid request' : 'Please wait'}
      </p>
    </div>
  );
};

export default VerifyEmail;
