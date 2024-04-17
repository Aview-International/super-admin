import React from 'react';
import FormInput from '../FormComponents/FormInput';
import Textarea from '../FormComponents/Textarea';
import CustomSelectInput from '../FormComponents/CustomSelectInput';
import CustomSelectInputChildren from '../FormComponents/CustomSelectInputChildren';
import trash from '/public/img/icons/trash.svg';
import Image from 'next/image';

const Caption = ({
  captionKey,
  index,
  captionsArray,
  setCaptionsArray,
  rectIndex,
  setRectIndex,
  rectangles,
  setRectangles,
  focused,
  setFocused,
}) => {
  const caption = captionsArray.find((caption) => caption.index === index);
  if (!caption) return null; // Handle the case where the caption is not found

  const updateCaptionDetails = (field, value) => {
    const updatedCaptionsArray = captionsArray.map((caption) => {
      if (caption.index === index) {
        return {
          ...caption,
          captionDetails: {
            ...caption.captionDetails,
            [field]: value,
          },
        };
      }
      return caption;
    });

    setCaptionsArray(updatedCaptionsArray);
  };

  const handleDeleteCaption = () => {
    const updatedCaptionsArray = captionsArray.filter(
      (caption) => caption.index !== index
    );
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
      <div
        className={`mb-s2 flex flex-col rounded-2xl bg-white-transparent p-s2 ${
          focused == index ? 'border-2 border-solid border-white' : ''
        }`}
        onClick={() => {
          setRectIndex(index);
          setFocused(index);
        }}
      >
        <div className="relative">
          <div className="float-left text-lg font-bold text-white">
            Caption #{captionKey + 1}
          </div>

          <div className="float-right">
            <Image
              src={trash}
              alt=""
              width={30}
              height={30}
              className="cursor-pointer"
              onClick={handleDeleteCaption}
            />
          </div>
        </div>

        <div className="mt-s1 text-lg font-bold text-white">Time</div>

        <div className="mt-s2 flex flex-row items-center">
          <FormInput
            label="Start time"
            placeholder="XX:XX:XX"
            value={caption.captionDetails.start_time}
            onChange={(e) => updateCaptionDetails('start_time', e.target.value)}
            name="startTime"
            labelClasses="text-lg text-white !mb-s1"
            valueClasses="placeholder-white text-lg font-light"
            classes="!mb-s2 !mr-s1"
          />

          <FormInput
            label="End time"
            placeholder="XX:XX:XX"
            value={caption.captionDetails.end_time}
            onChange={(e) => updateCaptionDetails('end_time', e.target.value)}
            name="endTime"
            labelClasses="text-lg text-white !mb-s1"
            valueClasses="placeholder-white text-lg font-light"
            classes="!mb-s2"
          />
        </div>

        <div className="h-[1px] w-full bg-white-transparent" />

        <div className="mt-s2 text-lg text-white">Text</div>
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
          onChange={(selectedOption) =>
            updateCaptionDetails('type', selectedOption)
          }
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-0"
        />

        <CustomSelectInputChildren
          text="Font"
          value={caption.captionDetails.font}
          options={['Normal caption', 'Comment caption']}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2 !mt-s2"
        >
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'Komika' }}
            onClick={() => updateCaptionDetails('font', 'Komika')}
          >
            Komika
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'LEMONMILK' }}
            onClick={() => updateCaptionDetails('font', 'LEMONMILK')}
          >
            LEMONMILK
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'Merriweather' }}
            onClick={() => updateCaptionDetails('font', 'Merriweather')}
          >
            Merriweather
          </p>
          <p
            className="my-[2px] bg-black p-s1 "
            style={{ fontFamily: 'Montserrat' }}
            onClick={() => updateCaptionDetails('font', 'Montserrat')}
          >
            Montserrat
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'NotoSans' }}
            onClick={() => updateCaptionDetails('font', 'NotoSans')}
          >
            NotoSans
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'Proxima' }}
            onClick={() => updateCaptionDetails('font', 'Proxima')}
          >
            Proxima
          </p>
          <p
            className="my-[2px] bg-black p-s1 "
            style={{ fontFamily: 'Roboto' }}
            onClick={() => updateCaptionDetails('font', 'Roboto')}
          >
            Roboto
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ fontFamily: 'Rubik' }}
            onClick={() => updateCaptionDetails('font', 'Rubik')}
          >
            Rubik
          </p>
        </CustomSelectInputChildren>

        <CustomSelectInputChildren
          text="Font color"
          value={caption.captionDetails.font_color}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-s2"
        >
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 255, 255)' }}
            onClick={() => updateCaptionDetails('font_color', 'Black')}
          >
            Black
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 255, 255)' }}
            onClick={() => updateCaptionDetails('font_color', 'White')}
          >
            White
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(254, 44, 85)' }}
            onClick={() => updateCaptionDetails('font_color', 'Razzmatazz')}
          >
            Razzmatazz
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(238, 29, 82)' }}
            onClick={() => updateCaptionDetails('font_color', "Crayola's Red")}
          >
            Crayola&#39;s Red
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(191, 148, 228)' }}
            onClick={() => updateCaptionDetails('font_color', 'Lavender')}
          >
            Lavender
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(169, 223, 191)' }}
            onClick={() => updateCaptionDetails('font_color', 'Mint Green')}
          >
            Mint Green
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 229, 180)' }}
            onClick={() => updateCaptionDetails('font_color', 'Peach')}
          >
            Peach
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 182, 193)' }}
            onClick={() => updateCaptionDetails('font_color', 'Baby Pink')}
          >
            Baby Pink
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(211, 211, 211)' }}
            onClick={() => updateCaptionDetails('font_color', 'Light Grey')}
          >
            Light Grey
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(135, 206, 235)' }}
            onClick={() => updateCaptionDetails('font_color', 'Sky Blue')}
          >
            Sky Blue
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 253, 208)' }}
            onClick={() => updateCaptionDetails('font_color', 'Cream')}
          >
            Cream
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(0, 128, 128)' }}
            onClick={() => updateCaptionDetails('font_color', 'Teal')}
          >
            Teal
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 127, 80)' }}
            onClick={() => updateCaptionDetails('font_color', 'Coral')}
          >
            Coral
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(75, 0, 130)' }}
            onClick={() => updateCaptionDetails('font_color', 'Indigo')}
          >
            Indigo
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(64, 224, 208)' }}
            onClick={() => updateCaptionDetails('font_color', 'Turquoise')}
          >
            Turquoise
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 191, 0)' }}
            onClick={() => updateCaptionDetails('font_color', 'Amber')}
          >
            Amber
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(142, 69, 133)' }}
            onClick={() => updateCaptionDetails('font_color', 'Plum')}
          >
            Plum
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(244, 196, 48)' }}
            onClick={() => updateCaptionDetails('font_color', 'Saffron')}
          >
            Saffron
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(107, 142, 35)' }}
            onClick={() => updateCaptionDetails('font_color', 'Olive Green')}
          >
            Olive Green
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(224, 176, 255)' }}
            onClick={() => updateCaptionDetails('font_color', 'Mauve')}
          >
            Mauve
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(204, 85, 0)' }}
            onClick={() => updateCaptionDetails('font_color', 'Burnt Orange')}
          >
            Burnt Orange
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(48, 172, 228)' }}
            onClick={() => updateCaptionDetails('font_color', 'Ocean Blue')}
          >
            Ocean Blue
          </p>
        </CustomSelectInputChildren>

        <CustomSelectInputChildren
          text="background color"
          value={caption.captionDetails.background_color}
          labelClasses="text-lg text-white !mb-s1"
          valueClasses="text-lg !text-white ml-s1 font-light"
          classes="!mb-0"
        >
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 255, 255)' }}
            onClick={() => updateCaptionDetails('background_color', 'Black')}
          >
            Black
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 255, 255)' }}
            onClick={() => updateCaptionDetails('background_color', 'White')}
          >
            White
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(254, 44, 85)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Razzmatazz')
            }
          >
            Razzmatazz
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(238, 29, 82)' }}
            onClick={() =>
              updateCaptionDetails('background_color', "Crayola's Red")
            }
          >
            Crayola&#39;s Red
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(191, 148, 228)' }}
            onClick={() => updateCaptionDetails('background_color', 'Lavender')}
          >
            Lavender
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(169, 223, 191)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Mint Green')
            }
          >
            Mint Green
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 229, 180)' }}
            onClick={() => updateCaptionDetails('background_color', 'Peach')}
          >
            Peach
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 182, 193)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Baby Pink')
            }
          >
            Baby Pink
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(211, 211, 211)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Light Grey')
            }
          >
            Light Grey
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(135, 206, 235)' }}
            onClick={() => updateCaptionDetails('background_color', 'Sky Blue')}
          >
            Sky Blue
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 253, 208)' }}
            onClick={() => updateCaptionDetails('background_color', 'Cream')}
          >
            Cream
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(0, 128, 128)' }}
            onClick={() => updateCaptionDetails('background_color', 'Teal')}
          >
            Teal
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 127, 80)' }}
            onClick={() => updateCaptionDetails('background_color', 'Coral')}
          >
            Coral
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(75, 0, 130)' }}
            onClick={() => updateCaptionDetails('background_color', 'Indigo')}
          >
            Indigo
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(64, 224, 208)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Turquoise')
            }
          >
            Turquoise
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(255, 191, 0)' }}
            onClick={() => updateCaptionDetails('background_color', 'Amber')}
          >
            Amber
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(142, 69, 133)' }}
            onClick={() => updateCaptionDetails('background_color', 'Plum')}
          >
            Plum
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(244, 196, 48)' }}
            onClick={() => updateCaptionDetails('background_color', 'Saffron')}
          >
            Saffron
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(107, 142, 35)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Olive Green')
            }
          >
            Olive Green
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(224, 176, 255)' }}
            onClick={() => updateCaptionDetails('background_color', 'Mauve')}
          >
            Mauve
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(204, 85, 0)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Burnt Orange')
            }
          >
            Burnt Orange
          </p>
          <p
            className="my-[2px] bg-black p-s1"
            style={{ color: 'rgb(48, 172, 228)' }}
            onClick={() =>
              updateCaptionDetails('background_color', 'Ocean Blue')
            }
          >
            Ocean Blue
          </p>
        </CustomSelectInputChildren>
      </div>
    </>
  );
};

export default Caption;
