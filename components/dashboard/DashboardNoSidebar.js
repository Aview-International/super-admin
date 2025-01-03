import aviewLogo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import defaultProfilePicture from '../../public/img/graphics/default.png';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ReviewerSettingsPopup from './ReviewerSettingsPopup';
import GlobalButton from '../UI/GlobalButton';
import { logoutUser } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { logOut } from '../../store/reducers/user.reducer';

const DashboardNoSidebar = ({ children }) => {
  const translator = useSelector((data) => data.user);
  const [settings, setSettings] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    logoutUser();
  };

  return (
    <div>
      <ReviewerSettingsPopup
        show={settings}
        onClose={() => {
          setSettings(false);
        }}
        user={translator}
      />
      <header className="flex w-full items-center justify-between px-s4 py-s2">
        <div className="flex">
          <Link href="/dashboard" className="mx-s4 capitalize">
            <Image
              src={aviewLogo}
              alt="AVIEW International logo"
              width={56}
              height={56}
            />
          </Link>
          <div className="pt-s1">
            <h3>Hello {translator ? translator.name : ''}!</h3>
            <h3 className="text-gray-2">Welcome to your AVIEW dashboard</h3>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div>
            <GlobalButton
              purpose="onClick"
              onClick={handleLogOut}
              type="primary"
              fullWidth={true}
            >
              Sign Out
            </GlobalButton>
          </div>
          <button
            onClick={() => {
              setSettings(true);
            }}
          >
            <Image
              src={translator.profilePicture || defaultProfilePicture}
              alt="profile"
              width={52}
              height={52}
              className="cursor-pointer rounded-full"
            />
          </button>
        </div>
      </header>
      <div className="h-[1px] w-full bg-gray-1"></div>

      <main className="relative">{children}</main>
    </div>
  );
};

export default DashboardNoSidebar;
