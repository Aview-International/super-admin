import { useState, useEffect, useRef,  } from 'react';
import warning from '/public/img/icons/warning.svg';
import Image from 'next/image';

const QATranslationBubble = ({ index, time, text, updateText, width, height, editable=true, offensive=false }) => {
  const textAreaRef = useRef(null);
  const [editedText, setEditedText] = useState(text);
  const [imageLoaded, setImageLoaded] = useState(false);

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
  }, [editedText, width, height, text, imageLoaded]);
  
  return (
    <div className="qa-translation-bubble">
      <div className="header">
        <span className="text-white mr-3">{index}</span>
        <span className="text-gray-2 text-sm">{times[0]} - {times[1]}</span>
      </div>
      <div className="flex flex-row items-center mb-s1 bg-indigo-2 rounded-lg">
        <textarea 
          className={`w-full active:outline-none focus:outline-none rounded-lg p-3 bg-transparent text-white resize-none`}
          value={editedText} 
          onChange={handleTextChange} 
          ref={textAreaRef}
          disabled={!editable}
          rows="1"
        />
        {offensive && 
        <div className="relative mr-s2 top-[3px]">
          <Image src={warning} onLoad={() => setImageLoaded(true)}></Image>
        </div>}
      </div>
    </div>
  );
};

export default QATranslationBubble;

