const DashBoardHeader = ({ user }) => {
  return (
    <header className="flex w-full items-center justify-between px-s9 py-s4 text-white">
      <div>
        <h3 className="text-xl">Good morning {user.firstName}!</h3>
        <p className="text-lg text-gray-2">Welcome to your Aview dashboard</p>
      </div>
    </header>
  );
};

export default DashBoardHeader;
