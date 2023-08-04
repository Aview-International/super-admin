import { useEffect, useState } from 'react';
import useGreeting from '../../hooks/useGreeting';

const DashBoardHeader = ({ user }) => {
  const [time, setTime] = useState(useGreeting());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(useGreeting());
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="flex w-full items-center justify-between px-s9 py-s4 text-white">
      <div>
        <h3 className="text-xl"> {time + ' ' + user.firstName}!</h3>
        <p className="text-lg text-gray-2">Welcome to your Aview dashboard</p>
      </div>
    </header>
  );
};

export default DashBoardHeader;
