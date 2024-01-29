import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../store/user-profile';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import DashBoardHeader from './Header';
import DashboardSidebar from './Sidebar';
import { hasPermisions, PermissionSet, Roles } from '../../hooks/permissions';
import { getUserProfile } from '../../pages/api/firebase';

const DashboardStructure = ({ children }) => {
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const getProfile = async () => {
    try {
      const _id = localStorage.getItem('uid');
      const res = await getUserProfile(_id);
      updateUser({
        ...user,
        email: res.email,
        picture: res.picture,
        firstName: res.firstName,
        lastName: res.lastName,
        youtubeChannelId: res.youtubeChannelId,
        youtubeChannelName: res.youtubeChannelName,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <main className="gradient-dark flex min-h-screen h-screen w-full">
          <DashboardSidebar user={user} />
          <div className="ml-auto w-[calc(100%-170px)]">
            <DashBoardHeader user={user} />
            <div className="max-h-[calc(100%-116px)] overflow-y-auto bg-black p-s8">
              {children}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

const DashboardLayout = (page) => (
  <DashboardStructure>{page}</DashboardStructure>
);
export default DashboardLayout;
