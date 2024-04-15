import OutsideClickHandler from 'react-outside-click-handler';

const Popup = ({ show, children, onClose, disableClose }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur ${
        show ? 'translate-y-0' : 'translate-y-full'
      } transition-300 duration-500 ease-in-out`}
    >
      <div classes="w-full h-full relative">
        <OutsideClickHandler onOutsideClick={disableClose ? null : onClose}>
          {children}
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default Popup;
