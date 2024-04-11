import aviewLogo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import defaultProfilePicture from '../../public/img/graphics/default.png';

const DashboardStructure = ({ children, setSettings, name, profilePicture=defaultProfilePicture }) => {

  return (
    <>
        <div>
        <header className="flex w-full items-center justify-between pt-s2 pb-s1 text-white pr-s8">
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
            <div className="pt-[9px]">
              <div>
                <h3 className="text-base"> Hello {name}!</h3>
                <h3 className="text-base text-gray-2"> Welcome to your AVIEW dashboard</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div>
              <img src={profilePicture ? profilePicture : "/img/graphics/default.png"}  style={{width:"52px", height:"52px"}} alt="settings button" width={52} height={52} className="cursor-pointer rounded-full" onClick={() => {setSettings(true)}}/>
            </div>
          </div>
        </header>
          <div className="h-[1px] w-full bg-gray-1"></div>
  
          <main>{children}</main>
          
        </div>
    </>
  );
};

const DashboardLayout = ({ setSettings, children, name, profilePicture=defaultProfilePicture }) => (
  <DashboardStructure setSettings={setSettings} name={name} profilePicture={profilePicture} >{children}</DashboardStructure>
);
export default DashboardLayout;

