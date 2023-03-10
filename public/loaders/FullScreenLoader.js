import Image from 'next/image';
import aviewLogo from '../../public/img/aview/logo.svg';

const FullScreenLoader = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black">
      <div className="block animate-pulse">
        <Image
          src={aviewLogo}
          alt="AVIEW International logo"
          width={80}
          height={80}
        />
      </div>
    </div>
  );
};

export default FullScreenLoader;
