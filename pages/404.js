import Image from 'next/image';
import Button from '../components/UI/Button';
import aviewLogo from '../public/img/aview/logo.svg';
import { useRouter } from 'next/router';

const Page404 = () => {
  const router = useRouter();

  return (
    <div className="h-screen-trick grid w-screen place-content-center text-center">
      <h1 className="-mb-s2 -mt-s6 flex items-center gap-s3 sm:-mb-s5 md:-mb-s8 md:gap-s4">
        <span className="gradient-text gradient-1 text-[120px] font-bold xs:text-[160px] sm:text-[200px] md:text-[300px]">
          4
        </span>
        <span className="-mt-6 w-[100px] xs:w-[130px] sm:-mt-8 sm:w-[160px] md:-mt-14 md:w-[240px]">
          <Image
            src={aviewLogo}
            alt="AVIEW International logo"
            width={240}
            height={240}
          />
        </span>
        <span className="gradient-text gradient-1 text-[120px] font-bold xs:text-[160px] sm:text-[200px] md:text-[300px]">
          4
        </span>
      </h1>
      <p className="gradient-text gradient-1 inline-block pb-s1 text-6xl font-bold md:pb-s2 md:text-8xl">
        Page Not Found
      </p>
      <p className="pb-s4 text-lg text-white md:text-xl">
        Sorry, we were unable to find that page!
      </p>
      <div className="mx-auto w-40">
        <Button theme="light" onClick={() => router.push('/')}>
          Home
        </Button>
      </div>
    </div>
  );
};

export default Page404;
