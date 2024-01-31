import { useState } from 'react';
import { useEffect, useRef, } from 'react';

const QATranslationBubble = ({ index, time, text }) => {
  // State for the editable text
  const textAreaRef = useRef(null);
  const [editedText, setEditedText] = useState(text);

  //formatting data
  const times = time.split(' --> ');
  index = index.split(' ')[0];

  // Handler for text change
  const handleTextChange = (event) => {
    setEditedText(event.target.value);
  };

  useEffect(() => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }, [editedText])
  
  return (
    <div className="qa-translation-bubble">
        <div className="header">
            <span className="text-white mr-2">{index}</span>
            <span className="text-gray-2 text-sm">{times[0]} - {times[1]}</span>
        </div>
      <textarea 
        className="w-full active:outline-none focus:outline-none rounded-md p-2 bg-white-transparent text-white resize-none"  
        value={editedText} 
        onChange={handleTextChange} 
        ref={textAreaRef}
        rows="1"
      />
        
    </div>
  );
};

export default QATranslationBubble;
