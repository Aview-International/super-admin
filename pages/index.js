import { useState } from 'react';
import PageTitle from '../components/SEO/PageTitle';
import Button from '../components/UI/Button';
import FormInput from '../components/FormComponents/FormInput';
import { emailValidator } from '../utils/regex';
import ErrorHandler from '../utils/errorHandler';
import { singleSignOnLogin } from '../services/apis';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [email, setEmail] = useState('');

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

  return (
    <>
      <PageTitle title="Login" />
      <div className="fixed top-2/4 left-2/4 w-[min(400px,90%)] -translate-x-2/4 -translate-y-2/4 text-white">
        <h2 className="text-center text-7xl md:text-8xl">Log In</h2>
        {process.env.NODE_ENV !== 'production' &&
          (!hasSubmitted ? (
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
          ))}
      </div>
    </>
  );
};

export default Home;
