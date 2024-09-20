import aviewLogo from '../../public/img/aview/logo.svg';
import Image from 'next/image';

const DashboardStructure = ({ children }) => {
  return (
    <div>
      <header className="flex w-full items-center justify-between bg-white-transparent pt-s4 pb-s2.5 text-white">
        <div className="flex flex-row">
          <div className="flex w-[170px] justify-center">
            <a>
              <Image
                src={aviewLogo}
                alt="AVIEW International logo"
                width={56}
                height={56}
              />
            </a>
          </div>
          <div className="pl-s9">
            <div>
              <h3 className="text-xl"> Aview International</h3>
              <p className="text-lg text-gray-2">
                Welcome to Aview reviewer onboarding.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

const DashboardLayout = (page) => (
  <DashboardStructure>{page}</DashboardStructure>
);
export default DashboardLayout;
