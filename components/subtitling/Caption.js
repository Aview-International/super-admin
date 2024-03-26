import React from 'react';
import FormInput from '../FormComponents/FormInput';
import Textarea from '../FormComponents/Textarea';
import CustomSelectInput from '../FormComponents/CustomSelectInput';
import CustomSelectInputChildren from '../FormComponents/CustomSelectInputChildren';
import trash from '/public/img/icons/trash.svg'
import Image from 'next/image'

const Caption = ({ captionKey, index, captionsArray, setCaptionsArray, rectIndex, setRectIndex, rectangles, setRectangles, focused, setFocused }) => {
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

  const handleDeleteCaption = () => {
    const updatedCaptionsArray = captionsArray.filter(caption => caption.index!== index);
    setCaptionsArray(updatedCaptionsArray);

    const updatedRectanglesArray = rectangles.map((item, currentIndex) => {
      if (index === currentIndex) {
        return null;
      }
      return item;
    });
    setRectangles(updatedRectanglesArray);
    setRectIndex(null);


  };

  return (
    <>
      <div className={`p-s2 bg-white-transparent rounded-2xl mb-s2 flex flex-col ${(focused==index) ? "border-solid border-white border-2" : ""}`} onClick={() => {setRectIndex(index);setFocused(index)}}>
        <div className="relative">
          <div className='float-left text-white text-lg font-bold'>
            Caption #{captionKey+1}
          </div>

          <div className="float-right">
          <Image src={trash} alt="" width={30} height={30} className="cursor-pointer" onClick={handleDeleteCaption}/>
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

        <div className="text-white text-lg mt-s2">Text</div>
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
          classes="!mb-0"
        />

        <CustomSelectInputChildren
          text="Font"
          value={caption.captionDetails.font}
          options={['Normal caption','Comment caption']}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2 !mt-s2"
        >
          
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "Coolvetica" }} onClick={() => updateCaptionDetails('font', 'Coolvetica')}>Coolvetica</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "Komika" }} onClick={() => updateCaptionDetails('font', 'Komika')}>Komika</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "LEMONMILK" }} onClick={() => updateCaptionDetails('font', 'LEMONMILK')}>LEMONMILK</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "Merriweather" }} onClick={() => updateCaptionDetails('font', 'Merriweather')}>Merriweather</p>
          <p className="my-[2px] bg-black p-s1 " style={{ fontFamily: "Montserrat" }} onClick={() => updateCaptionDetails('font', 'Montserrat')}>Montserrat</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "NotoSans" }} onClick={() => updateCaptionDetails('font', 'NotoSans')}>NotoSans</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "Proxima" }} onClick={() => updateCaptionDetails('font', 'Proxima')}>Proxima</p>
          <p className="my-[2px] bg-black p-s1 " style={{ fontFamily: "Roboto" }} onClick={() => updateCaptionDetails('font', 'Roboto')}>Roboto</p>
          <p className="my-[2px] bg-black p-s1" style={{ fontFamily: "Rubik" }} onClick={() => updateCaptionDetails('font', 'Rubik')}>Rubik</p>
          
        </CustomSelectInputChildren>

        <CustomSelectInputChildren
          text="Font color"
          value={caption.captionDetails.fontColor}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2"
        >
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 255, 255)' }} onClick={() => updateCaptionDetails('fontColor', 'Black')}>Black</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 255, 255)' }} onClick={() => updateCaptionDetails('fontColor', 'White')}>White</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(254, 44, 85)' }} onClick={() => updateCaptionDetails('fontColor', 'Razzmatazz')}>Razzmatazz</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(238, 29, 82)' }} onClick={() => updateCaptionDetails('fontColor', "Crayola's Red")}>Crayola's Red</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(191, 148, 228)' }} onClick={() => updateCaptionDetails('fontColor', 'Lavender')}>Lavender</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(169, 223, 191)' }} onClick={() => updateCaptionDetails('fontColor', 'Mint Green')}>Mint Green</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 229, 180)' }} onClick={() => updateCaptionDetails('fontColor', 'Peach')}>Peach</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 182, 193)' }} onClick={() => updateCaptionDetails('fontColor', 'Baby Pink')}>Baby Pink</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(211, 211, 211)' }} onClick={() => updateCaptionDetails('fontColor', 'Light Grey')}>Light Grey</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(135, 206, 235)' }} onClick={() => updateCaptionDetails('fontColor', 'Sky Blue')}>Sky Blue</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 253, 208)' }} onClick={() => updateCaptionDetails('fontColor', 'Cream')}>Cream</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(0, 128, 128)' }} onClick={() => updateCaptionDetails('fontColor', 'Teal')}>Teal</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 127, 80)' }} onClick={() => updateCaptionDetails('fontColor', 'Coral')}>Coral</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(75, 0, 130)' }} onClick={() => updateCaptionDetails('fontColor', 'Indigo')}>Indigo</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(64, 224, 208)' }} onClick={() => updateCaptionDetails('fontColor', 'Turquoise')}>Turquoise</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 191, 0)' }} onClick={() => updateCaptionDetails('fontColor', 'Amber')}>Amber</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(142, 69, 133)' }} onClick={() => updateCaptionDetails('fontColor', 'Plum')}>Plum</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(244, 196, 48)' }} onClick={() => updateCaptionDetails('fontColor', 'Saffron')}>Saffron</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(107, 142, 35)' }} onClick={() => updateCaptionDetails('fontColor', 'Olive Green')}>Olive Green</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(224, 176, 255)' }} onClick={() => updateCaptionDetails('fontColor', 'Mauve')}>Mauve</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(204, 85, 0)' }} onClick={() => updateCaptionDetails('fontColor', 'Burnt Orange')}>Burnt Orange</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(48, 172, 228)' }} onClick={() => updateCaptionDetails('fontColor', 'Ocean Blue')}>Ocean Blue</p>
        </CustomSelectInputChildren>

        <CustomSelectInputChildren
          text="Background color"
          value={caption.captionDetails.background}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-0"
        >
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 255, 255)' }} onClick={() => updateCaptionDetails('background', 'Black')}>Black</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 255, 255)' }} onClick={() => updateCaptionDetails('background', 'White')}>White</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(254, 44, 85)' }} onClick={() => updateCaptionDetails('background', 'Razzmatazz')}>Razzmatazz</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(238, 29, 82)' }} onClick={() => updateCaptionDetails('background', "Crayola's Red")}>Crayola's Red</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(191, 148, 228)' }} onClick={() => updateCaptionDetails('background', 'Lavender')}>Lavender</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(169, 223, 191)' }} onClick={() => updateCaptionDetails('background', 'Mint Green')}>Mint Green</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 229, 180)' }} onClick={() => updateCaptionDetails('background', 'Peach')}>Peach</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 182, 193)' }} onClick={() => updateCaptionDetails('background', 'Baby Pink')}>Baby Pink</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(211, 211, 211)' }} onClick={() => updateCaptionDetails('background', 'Light Grey')}>Light Grey</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(135, 206, 235)' }} onClick={() => updateCaptionDetails('background', 'Sky Blue')}>Sky Blue</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 253, 208)' }} onClick={() => updateCaptionDetails('background', 'Cream')}>Cream</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(0, 128, 128)' }} onClick={() => updateCaptionDetails('background', 'Teal')}>Teal</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 127, 80)' }} onClick={() => updateCaptionDetails('background', 'Coral')}>Coral</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(75, 0, 130)' }} onClick={() => updateCaptionDetails('background', 'Indigo')}>Indigo</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(64, 224, 208)' }} onClick={() => updateCaptionDetails('background', 'Turquoise')}>Turquoise</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(255, 191, 0)' }} onClick={() => updateCaptionDetails('background', 'Amber')}>Amber</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(142, 69, 133)' }} onClick={() => updateCaptionDetails('background', 'Plum')}>Plum</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(244, 196, 48)' }} onClick={() => updateCaptionDetails('background', 'Saffron')}>Saffron</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(107, 142, 35)' }} onClick={() => updateCaptionDetails('background', 'Olive Green')}>Olive Green</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(224, 176, 255)' }} onClick={() => updateCaptionDetails('background', 'Mauve')}>Mauve</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(204, 85, 0)' }} onClick={() => updateCaptionDetails('background', 'Burnt Orange')}>Burnt Orange</p>
          <p className="my-[2px] bg-black p-s1" style={{ color: 'rgb(48, 172, 228)' }} onClick={() => updateCaptionDetails('background', 'Ocean Blue')}>Ocean Blue</p>
        </CustomSelectInputChildren>
      </div>
    </>
  );
}

export default Caption;