import React, { useEffect, useState } from 'react';
import Border from './Border';

const Popup = ({ show, children, onClose, disableClose = false }) => {
  const [display, setDisplay] = useState(false);
  const [animationState, setAnimationState] = useState('hidden');

  useEffect(() => {
    if (show) {
      setDisplay(true);
      const timeoutId = setTimeout(() => {
        setAnimationState('showing');
      }, 10);
      return () => clearTimeout(timeoutId);
    } else {
      setAnimationState('hiding');
      const timeoutId = setTimeout(() => {
        setDisplay(false);
        setAnimationState('hidden');
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  const handleBackgroundClick = (e) => {
    if (!disableClose) {
      if (e.currentTarget === e.target) {
        setAnimationState('hiding');
        setTimeout(() => {
          onClose();
          setDisplay(false);
          setAnimationState('hidden');
        }, 500);
      }
    }
  };

  const backgroundStyle = {
    opacity: animationState === 'showing' || animationState === 'visible' ? 1 : 0,
    transition: 'opacity 0.5s ease-out',
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };

  const contentStyle = {
    transition: 'transform 0.5s ease-out',
    transform: animationState === 'showing' || animationState === 'visible' ? 'translateY(0)' : 'translateY(-100%)',
  };

  useEffect(() => {
    if (animationState === 'showing') {
      const timeoutId = setTimeout(() => {
        setAnimationState('visible');
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [animationState]);

  if (!display) return null;

  return (
    <div
      style={backgroundStyle}
      onClick={handleBackgroundClick}
      aria-hidden={!show}
    >
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div classes="w-full h-full relative">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
