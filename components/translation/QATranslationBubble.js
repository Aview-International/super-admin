import { useState } from 'react';
import { useEffect, useRef, } from 'react';

const QATranslationBubble = ({ index, time, text, updateText, width, height }) => {
  const textAreaRef = useRef(null);
  const [editedText, setEditedText] = useState(text);

  const times = time.split(' --> ');
  index = index.split(' ')[0];

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setEditedText(newText);
    updateText(newText); // Call the passed function to update parent's state
  };

  useEffect(() => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    setEditedText(text);
  }, [editedText, width, height, text]);
  
  return (
    <div className="qa-translation-bubble">
      <div className="header">
        <span className="text-white mr-3">{index}</span>
        <span className="text-gray-2 text-sm">{times[0]} - {times[1]}</span>
      </div>
      <textarea 
        className="w-full active:outline-none focus:outline-none rounded-lg p-3 bg-white-transparent text-white resize-none"  
        value={editedText} 
        onChange={handleTextChange} 
        ref={textAreaRef}
        rows="1"
      />
    </div>
  );
};

export default QATranslationBubble;

