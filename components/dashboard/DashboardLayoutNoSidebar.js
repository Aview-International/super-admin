import aviewLogo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import timeGreeting from '../../utils/timeGreeting';

const DashboardStructure = ({ children }) => {
    const [time, setTime] = useState(timeGreeting());
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(timeGreeting());
      }, 5000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);

  return (
    <>
      
        <div>
        <header className="flex w-full items-center justify-between pt-s4 pb-s2.5 text-white bg-white-transparent">
            <div className="flex flex-row">
                <div className="w-[170px] flex justify-center">
                    <Link href="/">
                    <a>
                        <Image
                        src={aviewLogo}
                        alt="AVIEW International logo"
                        width={56}
                        height={56}
                        />
                    </a>
                    </Link>
                </div>
                <div className="pl-s9">
                    <div>
                        <h3 className="text-xl"> {time}!</h3>
                        <p className="text-lg text-gray-2">Welcome to Aview reviewer onboarding.</p>
                    </div>
                </div>
            </div>
        </header>
  
            <main>{children}</main>
        </div>
    </>
  );
};

const DashboardLayout = (page) => (
  <DashboardStructure>{page}</DashboardStructure>
);
export default DashboardLayout;

