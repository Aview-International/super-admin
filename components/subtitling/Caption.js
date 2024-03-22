import React from 'react';
import FormInput from '../FormComponents/FormInput';
import Textarea from '../FormComponents/Textarea';
import CustomSelectInput from '../FormComponents/CustomSelectInput';
import trash from '/public/img/icons/trash.svg'
import Image from 'next/image'

const Caption = ({ captionKey, index, captionsArray, setCaptionsArray, rectIndex, setRectIndex }) => {
  const caption = captionsArray.find(caption => caption.index === index);
  if (!caption) return null; // Handle the case where the caption is not found

  const updateCaptionDetails = (field, value) => {
    const updatedCaptionsArray = captionsArray.map(caption => {
      if (caption.index === index) {
        return {
          ...caption,
          captionDetails: {
            ...caption.captionDetails,
            [field]: value
          }
        };
      }
      return caption;
    });

    setCaptionsArray(updatedCaptionsArray);
  };

  return (
    <>
      <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex flex-col" onClick={() => setRectIndex(index)}>
        <div className="relative">
          <div className='float-left text-white text-lg font-bold'>
            Caption #{captionKey+1}
          </div>

          <div className="float-right">
          <Image src={trash} alt="" width={30} height={30} className=""/>
          </div>
        </div>

        <div className="text-white text-lg mt-s1 font-bold">Time</div>

        <div className="flex flex-row items-center mt-s2">
          <FormInput
            label="Start time"
            placeholder="00:00:00"
            value={caption.captionDetails.start}
            onChange={(e) => updateCaptionDetails('start', e.target.value)}
            name="startTime"
            labelClasses="text-lg text-white !mb-s1"
            valueClasses="placeholder-white text-lg font-light"
            classes="!mb-s2 !mr-s1"
          />

          <FormInput
            label="End time"
            placeholder="00:00:00"
            value={caption.captionDetails.end}
            onChange={(e) => updateCaptionDetails('end', e.target.value)}
            name="endTime"
            labelClasses="text-lg text-white !mb-s1"
            valueClasses="placeholder-white text-lg font-light"
            classes="!mb-s2"
          />
        </div>

        <div className="w-full h-[1px] bg-white-transparent"/>

        <div className="text-white text-lg mt-s2 font-bold">Text</div>
        <Textarea
          placeholder="Caption text"
          classes="!mb-s2"
          textAreaClasses="text-lg text-white placeholder-white font-light"
          value={caption.captionDetails.text}
          onChange={(e) => updateCaptionDetails('text', e.target.value)}
        />

        <CustomSelectInput
          text="Type"
          value={caption.captionDetails.type}
          options={['Normal caption', 'Comment caption']}
          onChange={(selectedOption) => updateCaptionDetails('type', selectedOption)}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2"
        />

        <CustomSelectInput
          text="Font"
          value={caption.captionDetails.font}
          options={['Arial', 'Verdana', 'Helvetica']}
          onChange={(selectedOption) => updateCaptionDetails('font', selectedOption)}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2"
        />

        <CustomSelectInput
          text="Background color"
          value={caption.captionDetails.background}
          options={['Red', 'Blue', 'Green']}
          onChange={(selectedOption) => updateCaptionDetails('background', selectedOption)}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-0"
        />
      </div>
    </>
  );
}

export default Caption;