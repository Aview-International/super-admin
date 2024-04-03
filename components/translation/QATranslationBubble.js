import { useState, useEffect, useRef } from 'react';
import warning from '/public/img/icons/warning.svg';
import Image from 'next/image';

const QATranslationBubble = ({
  index,
  time,
  text,
  updateText,
  width,
  height,
  editable = true,
  offensive = false,
}) => {
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
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    setEditedText(text);
  }, [editedText, width, height, text, imageLoaded]);

  return (
    <div className="qa-translation-bubble">
      <div className="header">
        <span className="mr-3 text-white">{index}</span>
        <span className="text-sm text-gray-2">
          {times[0]} - {times[1]}
        </span>
      </div>
      <div className="mb-s1 flex flex-row items-center rounded-lg bg-indigo-2">
        <textarea
          className={`w-full resize-none rounded-lg bg-transparent p-3 text-white focus:outline-none active:outline-none`}
          value={editedText}
          onChange={handleTextChange}
          ref={textAreaRef}
          disabled={!editable}
          rows="1"
        />
        {offensive && (
          <div className="relative top-[3px] mr-s2">
            <Image src={warning} onLoad={() => setImageLoaded(true)} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QATranslationBubble;
