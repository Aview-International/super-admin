import React, { useState, useRef, useEffect } from 'react';

const ExpandableDescription = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state to track transition
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const maxLines = 2;
      textRef.current.style.maxHeight = `${lineHeight * maxLines}px`; // Set a default max-height
      setIsOverflow(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [text]); // Depend on text to recheck on text change

  const toggleIsExpanded = () => {
    setIsTransitioning(true); // Start of transition
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      textRef.current.style.maxHeight = `${textRef.current.scrollHeight}px`;
    } else {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const maxLines = 2;
      textRef.current.style.maxHeight = `${lineHeight * maxLines}px`;
    }

    setTimeout(() => {
      setIsTransitioning(false); // End of transition
    }, 500); // Same duration as your CSS transition
  };

  const ellipsisStyles = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
  };

  return (
    <div className="bg-white-transparent rounded-2xl p-4 mb-6">
      <div className="w-full">
        <h2 className="text-lg text-white mb-2">
          Description
        </h2>

        <div 
          ref={textRef} 
          className="text-lg text-white overflow-hidden transition-max-height duration-500 ease-in-out"
          style={!isExpanded && !isTransitioning && isOverflow ? ellipsisStyles : {}}
        >
          <p> 
            {text}
          </p>
        </div>

        {isOverflow && (
          <button
            className="text-lg text-white mt-4"
            onClick={toggleIsExpanded}
          >
            {isExpanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpandableDescription;
