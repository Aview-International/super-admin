import React, { useEffect, useState } from 'react';
import Border from './Border';

const Popup = ({ show, children, onClose }) => {
  const [display, setDisplay] = useState(false); // Controls the display of the entire component
  const [animationState, setAnimationState] = useState('hidden'); // New state to manage animation states: 'hidden', 'showing', 'visible', 'hiding'

  // Effect for managing display and animations
  useEffect(() => {
    if (show) {
      setDisplay(true); // Make the entire component visible
      // Use a slight delay before starting the animations to ensure the initial state is rendered
      const timeoutId = setTimeout(() => {
        setAnimationState('showing');
      }, 10); // A minimal delay to ensure transition can occur
      return () => clearTimeout(timeoutId);
    } else {
      setAnimationState('hiding'); // Start content slide-out and background fade-out animations
      const timeoutId = setTimeout(() => {
        setDisplay(false); // Hide the entire component after animations
        setAnimationState('hidden'); // Reset animation state
      }, 500); // Delay should match the longest animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  const handleBackgroundClick = (e) => {
    if (e.currentTarget === e.target) {
      setAnimationState('hiding'); // Begin content slide-out and background fade-out animations
      setTimeout(() => {
        onClose(); // Delay onClose to allow animations to complete
        setDisplay(false); // Hide the entire component after animations
        setAnimationState('hidden'); // Reset animation state
      }, 500); // Ensure this matches the transition duration
    }
  };

  // Apply styles based on the animation state
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

  // Update the animation state to 'visible' after the showing transition is started
  useEffect(() => {
    if (animationState === 'showing') {
      const timeoutId = setTimeout(() => {
        setAnimationState('visible');
      }, 500); // Match the transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [animationState]);

  if (!display) return null; // Do not render the component if it should not be displayed

  return (
    <div style={backgroundStyle} onClick={handleBackgroundClick} aria-hidden={!show}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <Border classes="w-full h-full relative rounded-2xl">
          {children}
        </Border>
      </div>
    </div>
  );
};

export default Popup;
