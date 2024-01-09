import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

const Landing = () => {
  const router = useRouter();
  const auth = useAuth();
  useEffect(() => {
    if (auth) {
      router.push('/transcription');
    } else {
      router.push('/login');
    }
  }, []);
  return;
};

export default Landing;
