import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {


  const [user, updateUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    picture: '',
    youtubeChannelId: '',
  });

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
