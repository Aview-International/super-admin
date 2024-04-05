import aviewLogo from '../../public/img/aview/logo.svg';
import settingsIcon from '../../public/img/icons/settings.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import timeGreeting from '../../utils/timeGreeting';

const DashboardStructure = ({ children, setSettings }) => {
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
        <header className="flex w-full items-center justify-between pt-s4 pb-s2.5 text-white bg-white-transparent pr-s8">
          <div className="flex">
            <div className="w-[170px] flex justify-center">
              <Link href="/dashboard">
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
            <div className="pt-[13px]">
              <div>
                <h3 className="text-xl"> Welcome to your AVIEW dashboard</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div>
              <Image src={settingsIcon} alt="settings button" width={36} height={36} className="cursor-pointer" onClick={() => {setSettings(true)}}/>
            </div>
          </div>
        </header>
  
            <main>{children}</main>
        </div>
    </>
  );
};

const DashboardLayout = ({ setSettings, children }) => (
  <DashboardStructure setSettings={setSettings} >{children}</DashboardStructure>
);
export default DashboardLayout;

