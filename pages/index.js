import { useEffect, useState } from 'react';
import PageTitle from '../components/SEO/PageTitle';
import Button from '../components/UI/Button';
import FormInput from '../components/FormComponents/FormInput';
import { emailValidator } from '../utils/regex';
import ErrorHandler from '../utils/errorHandler';
import { singleSignOnLogin } from '../services/apis';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import CircleLoader from '../public/loaders/CircleLoader';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) router.push('/dashboard');
        setIsAuthLoading(false);
      } catch (error) {}
    });

    return () => unsubscribe();
  }, []);

  const handleSSO = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      localStorage.setItem('emailForSignIn', email);
      await singleSignOnLogin(email, window.location.origin);
      setHasSubmitted(true);
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  return isAuthLoading ? (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black text-white">
      <CircleLoader />
    </div>
  ) : (
    <>
      <PageTitle title="Login" />
      <div className="fixed left-2/4 top-2/4 w-[min(400px,90%)] -translate-x-2/4 -translate-y-2/4 text-white">
        <h2 className="text-center text-7xl md:text-8xl">Log In</h2>
        {!hasSubmitted ? (
          <form onSubmit={handleSSO}>
            <FormInput
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isValid={emailValidator(email)}
              hideCheckmark
              type="email"
              name="email"
            />
            <Button isLoading={isLoading} type>
              Continue
            </Button>
          </form>
        ) : (
          <p className="text-center text-xl">
            An email is on the way 🚀
            <br />
            Check your inbox to proceed
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
