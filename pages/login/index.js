import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Border from '../../components/UI/Border';
import Shadow from '../../components/UI/Shadow';
import Google from '../../public/img/icons/google.svg';
import { UserContext } from '../../store/user-profile';
import ButtonLoader from '../../public/loaders/ButtonLoader';
import Cookies from 'js-cookie';
import { signInWithGoogle } from '../api/firebase';
import PageTitle from '../../components/SEO/PageTitle';

const Login = () => {
  const router = useRouter();
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const { _tokenResponse } = await signInWithGoogle();
    Cookies.set('token', _tokenResponse.idToken, { expires: 3 });
    localStorage.setItem('uid', _tokenResponse.localId);
    updateUser({
      ...user,
      email: _tokenResponse.email,
      firstName: _tokenResponse.firstName,
      lastName: _tokenResponse.lastName,
      picture: _tokenResponse.photoUrl,
    });
    const prevRoute = Cookies.get('redirectUrl');
    if (prevRoute) {
      Cookies.remove('redirectUrl');
      router.push(decodeURIComponent(prevRoute));
    } else router.push('/transcription');
  };

  return (
    <>
      <PageTitle title="Login" />
      <div className="fixed top-2/4 left-2/4 w-[min(400px,90%)] -translate-x-2/4 -translate-y-2/4 text-white">
        <h2 className="text-center text-7xl md:text-8xl">Log In</h2>
        <Shadow classes="w-full mb-4">
          <Border borderRadius="full" classes="w-full">
            <button
              className="flex w-full items-center justify-center rounded-full bg-black p-2 text-white md:p-3"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <ButtonLoader />
              ) : (
                <>
                  <span className="flex items-center justify-center pr-s1">
                    <Image src={Google} alt="Google" />
                  </span>
                  Continue with Google
                </>
              )}
            </button>
          </Border>
        </Shadow>
      </div>
    </>
  );
};

export default Login;
