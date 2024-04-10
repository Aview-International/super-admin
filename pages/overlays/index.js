import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import VideoAnnotator from '../../components/subtitling/VideoAnnotator';
import TimelineSlider from '../../components/subtitling/TimelineSlider';
import Image from 'next/image';
import FormInput from '../../components/FormComponents/FormInput';
import CustomSelectInputChildren from '../../components/FormComponents/CustomSelectInputChildren';
import Caption from '../../components/subtitling/Caption';
import Button from '../../components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import trash from '/public/img/icons/trash.svg';
import plus from '/public/img/icons/plus.svg';
import ErrorHandler from '../../utils/errorHandler';
import { useRouter } from 'next/router';
import { 
  getDownloadLink, 
  submitOverlayJob, 
  getTranslatorFromUserId,
  getJobAndVerify } from '../../services/apis';
import Popup from '../../components/UI/PopupWithBorder';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import {
  getUserProfile,
  verifyTranslator,
  flagOverlayJob,
} from '../../services/firebase';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import Timer from '../../components/UI/Timer';

const Shorts_subtitling = () => {
  const videoRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const [addRectangle, setAddRectangle] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [captionsArray, setCaptionsArray] = useState([]);
  const [rectIndex, setRectIndex] = useState(null);
  const [subtitle, setSubtitle] = useState(false);
  const [subtitleDetails, setSubtitleDetails] = useState(null);
  const [focused, setFocused] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [creatorPfp, setCreatorPfp] = useState(null);
  const [job, setJob] = useState(null);
  const [loader, setLoader] = useState('');
  const [popupSubmit, setPopupSubmit] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [translatorId, setTranslatorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { jobId } = router.query;

  const handleVideo = async () => {
    if (job && translatorId) {
      const res = await getUserProfile(job.creatorId);

      setCreatorName(res?.firstName + ' ' + res?.lastName);
      setCreatorPfp(res?.picture);

      const videoPath = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`;

      const downloadLink = await getDownloadLink(videoPath);

        console.log(downloadLink);
        setVideoLink(downloadLink.data);
      }
  }

  const handleTranslator = async (userId) => {
    const translator = await getTranslatorFromUserId(userId);
    console.log(translator.data._id);
    setTranslatorId(translator.data._id);
  };


  const handleFlag = async (jobId) => {
    try {
      const verify = await verifyTranslator(translatorId, jobId);

      if (!verify) {
        throw new Error('Job has expired');
      }

      setLoader('flag');
      await flagOverlayJob(jobId).then(() => {
        setLoader('');
        setPopupSubmit(true);
        setPopupText('Flagged!');
      });
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const getJob = async (jobId, translatorId) => {

    try {
        const job = await getJobAndVerify(translatorId, jobId)
        setJob(job.data);
        setIsLoading(false);
    }catch(error) {
        ErrorHandler(error);
    }
  }

  function timeStringToSeconds(timeString) {
    if (typeof timeString !== 'string' || !timeString.includes(':')) {
      throw new Error('Invalid time string format');
    }

    let parts = timeString.split(':');
    if (parts.length < 3 || !parts[2].includes('.')) {
      throw new Error('Time string must be in HH:MM:SS.sss format');
    }

    let secondsParts = parts[2].split('.');

    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parseInt(secondsParts[0], 10);
    let milliseconds = secondsParts[1] ? parseInt(secondsParts[1], 10) : 0;

    let totalSeconds =
      hours * 3600 + minutes * 60 + seconds + milliseconds / 100;

    return totalSeconds;
  }

  const handleSubmit = async (jobId) => {
    try {
      const verify = await verifyTranslator(translatorId, jobId);

      if (!verify) {
        throw new Error('Job has expired');
      }

      setLoader('submit');
      console.log(captionsArray, subtitleDetails);
      console.log(rectangles);

      let operationsArray = [];
      if (subtitleDetails) {
        operationsArray.push(subtitleDetails);
      }

      for (const caption of captionsArray) {
        operationsArray.push(caption.captionDetails);
      }

      console.log(operationsArray.entries());

      for (const operations of operationsArray) {
        const rectangle = rectangles[operations.index];
        console.log(rectangle);

        operations.top_left = rectangle.start;
        operations.top_right = rectangle.end;
        if (
          operations.start_time == '' ||
          validateTimeString(operations.start_time) ||
          operations.end_time == '' ||
          validateTimeString(operations.end_time)
        ) {
          throw new Error('invalid time');
        }
        operations.start_time = timeStringToSeconds(operations.start_time);
        operations.end_time = timeStringToSeconds(operations.end_time);
      }

      await submitOverlayJob(jobId).then(() => {
        setLoader('');
        setPopupSubmit(true);
        setPopupText('Submitted!');
      });
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const validateTimeString = (time) => {
    const pattern = /^\d{2}:\d{2}:\d{2}(\.\d{2})?$/;
    return pattern.test(time);
  }

  useEffect(() => {
    const token = Cookies.get("session");
    console.log(token);
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);

  },[]);

  useEffect(() => {
    if(jobId && translatorId) {
      getJob(jobId, translatorId);
    }
  },[jobId, translatorId]);

  useEffect(() => {
    if (job && translatorId) {
      handleVideo();
    }
  }, [job, translatorId]);

  const updateSubtitleDetails = (field, value) => {
    setSubtitleDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleAddRectangle = () => {
    setAddRectangle(true);
  };

  const handleCreateSubtitle = () => {
    if (subtitle) {
      return;
    }

    setSubtitle(true);

    let index = rectangles.length;

    if (!index) {
      index = 0;
    }

    handleAddRectangle();

    let subtitleDetails = {
      task: 'subtitle',
      index: index,
      start: '',
      end: '',
      font: 'Montserrat',
      font_color: 'white',
      outline_color: 'black',
      background: 'blurred',
      top_left: '',
      bottom_Right: '',
    };

    setSubtitleDetails(subtitleDetails);
    setRectIndex(index);
    setFocused(index);
  };

  const handleClickSubtitle = () => {
    if (!subtitle) {
      return;
    } else {
      setRectIndex(subtitleDetails.index);
    }
  };

  const handleDeleteSubtitle = () => {
    let index = subtitleDetails.index;
    const updatedRectanglesArray = rectangles.map((item, currentIndex) => {
      if (index === currentIndex) {
        return null;
      }
      return item;
    });
    setRectangles(updatedRectanglesArray);
    setRectIndex(null);

    setSubtitleDetails(null);
    setSubtitle(false);
  };

  const handleCreateCaption = () => {
    let index = rectangles.length;

    if (!index) {
      index = 0;
    }

    handleAddRectangle();

    let captionDetails = {
      task: 'caption',
      start_time: '',
      end_time: '',
      caption_text: '',
      type: 'normal caption',
      font: 'Montserrat',
      font_color: 'black',
      background_color: 'white',
      top_left: '',
      bottom_Right: '',
    };

    setCaptionsArray([
      ...captionsArray,
      { index: index, captionDetails: captionDetails },
    ]);

    setRectIndex(index);
    setFocused(index);
  };

  useEffect(() => {
    console.log(rectIndex);
    console.log(subtitle);
  }, [rectIndex, subtitle]);

  return (
    <>
      <PageTitle title="Captioning & Subtitling" />
      <Popup show={popupSubmit} disableClose={true}>
        <div className="h-full w-full">
          <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-s2 text-2xl text-white">{popupText}</h2>
              <p className="text-white">
                Please wait 1-2 business days for payment to process. Thank you.
              </p>
            </div>
          </div>
        </div>
      </Popup>
      {isLoading && <FullScreenLoader/>}
      <div className="flex flex-col h-screen">
        {videoLink && (
          <video
            ref={hiddenVideoRef}
            style={{ height: 'calc(100vh - 260px)', display: 'none' }}
          >
            <source src={videoLink ? videoLink : ''} type="video/mp4" />
          </video>
        )}
        <div
          className="flex flex-row px-s5"
          style={{ height: 'calc(100vh - 180px)' }}
        >
          <div className="flex w-2/3 justify-center">
            <div className="flex items-center">
              {videoLink && (
                <VideoAnnotator
                  videoUrl={videoLink ? videoLink : ''}
                  videoRef={videoRef}
                  addRectangle={addRectangle}
                  onRectangleAdded={() => setAddRectangle(false)}
                  rectIndex={rectIndex}
                  setRectIndex={setRectIndex}
                  rectangles={rectangles}
                  setRectangles={setRectangles}
                />
              )}
            </div>
          </div>
          <div
            className="w-1/3 pr-s2"
            style={{ height: 'calc(100vh - 220px)' }}
          >
            <div className="ml-s5 mt-s5 h-full w-full overflow-y-auto">
              <div className="mb-s2 rounded-2xl bg-white-transparent p-s2">
                <div className="flex flex-col justify-center">
                  <div className="flex flex-row items-center">
                    <div className="flex-shrink-0 flex-grow-0">
                      <Image
                        src={creatorPfp ? creatorPfp : ''}
                        className="rounded-full"
                        alt=""
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="ml-s2">
                      <div className="text-lg text-white">
                        {job ? job.videoData.caption : ''}
                      </div>

                      <div className="mt-[4px] text-sm text-white text-opacity-75">
                        {creatorName ? creatorName : ''}
                      </div>
                    </div>
                  </div>
                  <div className="mt-s2 grid grid-cols-2 justify-center gap-s2">
                    <Button
                      theme="error"
                      classes="flex justify-center items-center h-[48px]"
                      onClick={() => handleFlag(jobId)}
                      isLoading={loader === 'flag'}
                    >
                      <span className="mr-2">Flag</span>
                    </Button>

                    <Button
                      theme="success"
                      classes="flex justify-center items-center h-[48px]"
                      onClick={() => handleSubmit(jobId)}
                      isLoading={loader === 'submit'}
                    >
                      <span className="mr-2">Submit</span>
                      <Image src={Check} alt="" width={24} height={24} />
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="mb-s2 flex cursor-pointer flex-col justify-center rounded-2xl bg-white-transparent px-s2 pt-s2 pb-s1"
                onClick={handleCreateCaption}
              >
                <div className="relative">
                  <div
                    className={`float-left mt-[2px] text-2xl font-bold text-white`}
                  >
                    Captions
                  </div>

                  <div className="float-right">
                    <Image src={plus} alt="" width={30} height={30} />
                  </div>
                </div>
              </div>

              <div>
                {captionsArray.map((caption, i) => (
                  <Caption
                    key={i}
                    captionKey={i}
                    captionsArray={captionsArray}
                    setCaptionsArray={setCaptionsArray}
                    index={caption.index}
                    setRectIndex={setRectIndex}
                    rectIndex={rectIndex}
                    rectangles={rectangles}
                    setRectangles={setRectangles}
                    focused={focused}
                    setFocused={setFocused}
                  />
                ))}
              </div>

              <div
                className={`mb-s2 flex flex-col justify-center rounded-2xl bg-white-transparent px-s2 pt-s2 pb-s1 ${
                  subtitle ? '' : 'cursor-pointer'
                } ${
                  subtitleDetails && focused == subtitleDetails.index
                    ? 'border-2 border-solid border-white'
                    : ''
                }`}
                onClick={() => {
                  handleClickSubtitle();
                  handleCreateSubtitle();
                  if (subtitleDetails) {
                    setFocused(subtitleDetails.index);
                  }
                  console.log(focused);
                }}
              >
                <div className="relative">
                  <div className="float-left mt-[2px] text-2xl font-bold text-white">
                    Subtitles
                  </div>

                  {subtitle && (
                    <div className="float-right">
                      <Image
                        src={trash}
                        alt=""
                        width={30}
                        height={30}
                        onClick={handleDeleteSubtitle}
                      />
                    </div>
                  )}

                  {!subtitle && (
                    <div className="float-right">
                      <Image src={plus} alt="" width={30} height={30} />
                    </div>
                  )}
                </div>
                {subtitle && (
                  <div>
                    <div className="mt-s2 text-lg font-bold text-white">
                      Time
                    </div>

                    <div className="mt-s2 flex flex-row items-center">
                      <FormInput
                        label="Start time"
                        placeholder="00:00:00"
                        value={subtitleDetails.start}
                        onChange={(e) =>
                          updateSubtitleDetails('start', e.target.value)
                        }
                        name="title"
                        labelClasses="text-lg text-white !mb-s1"
                        valueClasses="placeholder-white text-lg font-light"
                        classes="!mb-s2 !mr-s1"
                      />

                      <FormInput
                        label="End time"
                        placeholder="00:00:00"
                        value={subtitleDetails.end}
                        onChange={(e) =>
                          updateSubtitleDetails('end', e.target.value)
                        }
                        name="title"
                        labelClasses="text-lg text-white !mb-s1"
                        valueClasses="placeholder-white text-lg font-light"
                        classes="!mb-s2 !mr-s1"
                      />
                    </div>

                    <div className="h-[1px] w-full bg-white-transparent" />

                    <div className="mt-s2 text-lg font-bold text-white">
                      Text style
                    </div>

                    <CustomSelectInputChildren
                      text="Font"
                      value={subtitleDetails.font}
                      labelClasses="text-lg text-white !mb-s1"
                      valueClasses="text-lg !text-white ml-s1 font-light"
                      classes="!mb-s2 !mt-s2"
                    >
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'Komika' }}
                        onClick={() => updateSubtitleDetails('font', 'Komika')}
                      >
                        Komika
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'LEMONMILK' }}
                        onClick={() =>
                          updateSubtitleDetails('font', 'LEMONMILK')
                        }
                      >
                        LEMONMILK
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'Merriweather' }}
                        onClick={() =>
                          updateSubtitleDetails('font', 'Merriweather')
                        }
                      >
                        Merriweather
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1 "
                        style={{ fontFamily: 'Montserrat' }}
                        onClick={() =>
                          updateSubtitleDetails('font', 'Montserrat')
                        }
                      >
                        Montserrat
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'NotoSans' }}
                        onClick={() =>
                          updateSubtitleDetails('font', 'NotoSans')
                        }
                      >
                        NotoSans
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'Proxima' }}
                        onClick={() => updateSubtitleDetails('font', 'Proxima')}
                      >
                        Proxima
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1 "
                        style={{ fontFamily: 'Roboto' }}
                        onClick={() => updateSubtitleDetails('font', 'Roboto')}
                      >
                        Roboto
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ fontFamily: 'Rubik' }}
                        onClick={() => updateSubtitleDetails('font', 'Rubik')}
                      >
                        Rubik
                      </p>
                    </CustomSelectInputChildren>

                    <CustomSelectInputChildren
                      text="Font color"
                      value={subtitleDetails.font_color}
                      labelClasses="text-lg text-white !mb-s1"
                      valueClasses="text-lg !text-white ml-s1 font-light"
                      classes="!mb-s2"
                    >
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Black')
                        }
                      >
                        Black
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'White')
                        }
                      >
                        White
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(254, 44, 85)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Razzmatazz')
                        }
                      >
                        Razzmatazz
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(238, 29, 82)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', "Crayola's Red")
                        }
                      >
                        Crayola&#39;s Red
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(191, 148, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Lavender')
                        }
                      >
                        Lavender
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(169, 223, 191)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Mint Green')
                        }
                      >
                        Mint Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 229, 180)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Peach')
                        }
                      >
                        Peach
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 182, 193)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Baby Pink')
                        }
                      >
                        Baby Pink
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(211, 211, 211)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Light Grey')
                        }
                      >
                        Light Grey
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(135, 206, 235)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Sky Blue')
                        }
                      >
                        Sky Blue
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 253, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Cream')
                        }
                      >
                        Cream
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(0, 128, 128)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Teal')
                        }
                      >
                        Teal
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 127, 80)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Coral')
                        }
                      >
                        Coral
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(75, 0, 130)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Indigo')
                        }
                      >
                        Indigo
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(64, 224, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Turquoise')
                        }
                      >
                        Turquoise
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 191, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Amber')
                        }
                      >
                        Amber
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(142, 69, 133)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Plum')
                        }
                      >
                        Plum
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(244, 196, 48)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Saffron')
                        }
                      >
                        Saffron
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(107, 142, 35)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Olive Green')
                        }
                      >
                        Olive Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(224, 176, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Mauve')
                        }
                      >
                        Mauve
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(204, 85, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Burnt Orange')
                        }
                      >
                        Burnt Orange
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(48, 172, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('font_color', 'Ocean Blue')
                        }
                      >
                        Ocean Blue
                      </p>
                    </CustomSelectInputChildren>

                    <CustomSelectInputChildren
                      text="Text outline"
                      value={subtitleDetails.outline_color}
                      labelClasses="text-lg text-white !mb-s1"
                      valueClasses="text-lg !text-white ml-s1 font-light"
                      classes="!mb-s2"
                    >
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'None')
                        }
                      >
                        None
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Black')
                        }
                      >
                        Black
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'White')
                        }
                      >
                        White
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(254, 44, 85)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Razzmatazz')
                        }
                      >
                        Razzmatazz
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(238, 29, 82)' }}
                        onClick={() =>
                          updateSubtitleDetails(
                            'outline_color',
                            "Crayola's Red"
                          )
                        }
                      >
                        Crayola&#39;s Red
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(191, 148, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Lavender')
                        }
                      >
                        Lavender
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(169, 223, 191)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Mint Green')
                        }
                      >
                        Mint Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 229, 180)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Peach')
                        }
                      >
                        Peach
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 182, 193)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Baby Pink')
                        }
                      >
                        Baby Pink
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(211, 211, 211)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Light Grey')
                        }
                      >
                        Light Grey
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(135, 206, 235)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Sky Blue')
                        }
                      >
                        Sky Blue
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 253, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Cream')
                        }
                      >
                        Cream
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(0, 128, 128)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Teal')
                        }
                      >
                        Teal
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 127, 80)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Coral')
                        }
                      >
                        Coral
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(75, 0, 130)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Indigo')
                        }
                      >
                        Indigo
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(64, 224, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Turquoise')
                        }
                      >
                        Turquoise
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 191, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Amber')
                        }
                      >
                        Amber
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(142, 69, 133)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Plum')
                        }
                      >
                        Plum
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(244, 196, 48)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Saffron')
                        }
                      >
                        Saffron
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(107, 142, 35)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Olive Green')
                        }
                      >
                        Olive Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(224, 176, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Mauve')
                        }
                      >
                        Mauve
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(204, 85, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Burnt Orange')
                        }
                      >
                        Burnt Orange
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(48, 172, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('outline_color', 'Ocean Blue')
                        }
                      >
                        Ocean Blue
                      </p>
                    </CustomSelectInputChildren>

                    <CustomSelectInputChildren
                      text="Background"
                      value={subtitleDetails.background}
                      labelClasses="text-lg text-white !mb-s1"
                      valueClasses="text-lg !text-white ml-s1 font-light"
                      classes="!mb-s2"
                    >
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'None')
                        }
                      >
                        Blurred
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'None')
                        }
                      >
                        None
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Black')
                        }
                      >
                        Black
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 255, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'White')
                        }
                      >
                        White
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(254, 44, 85)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Razzmatazz')
                        }
                      >
                        Razzmatazz
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(238, 29, 82)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', "Crayola's Red")
                        }
                      >
                        Crayola&#39;s Red
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(191, 148, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Lavender')
                        }
                      >
                        Lavender
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(169, 223, 191)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Mint Green')
                        }
                      >
                        Mint Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 229, 180)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Peach')
                        }
                      >
                        Peach
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 182, 193)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Baby Pink')
                        }
                      >
                        Baby Pink
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(211, 211, 211)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Light Grey')
                        }
                      >
                        Light Grey
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(135, 206, 235)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Sky Blue')
                        }
                      >
                        Sky Blue
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 253, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Cream')
                        }
                      >
                        Cream
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(0, 128, 128)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Teal')
                        }
                      >
                        Teal
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 127, 80)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Coral')
                        }
                      >
                        Coral
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(75, 0, 130)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Indigo')
                        }
                      >
                        Indigo
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(64, 224, 208)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Turquoise')
                        }
                      >
                        Turquoise
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(255, 191, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Amber')
                        }
                      >
                        Amber
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(142, 69, 133)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Plum')
                        }
                      >
                        Plum
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(244, 196, 48)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Saffron')
                        }
                      >
                        Saffron
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(107, 142, 35)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Olive Green')
                        }
                      >
                        Olive Green
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(224, 176, 255)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Mauve')
                        }
                      >
                        Mauve
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(204, 85, 0)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Burnt Orange')
                        }
                      >
                        Burnt Orange
                      </p>
                      <p
                        className="my-[2px] bg-black p-s1"
                        style={{ color: 'rgb(48, 172, 228)' }}
                        onClick={() =>
                          updateSubtitleDetails('background', 'Ocean Blue')
                        }
                      >
                        Ocean Blue
                      </p>
                    </CustomSelectInputChildren>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Third section */}
        <div className="h-[180px] w-full bg-white-transparent">
          {videoLink && (
            <TimelineSlider
              videoRef={videoRef}
              hiddenVideoRef={hiddenVideoRef}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Shorts_subtitling;
