import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../../components/SEO/PageTitle';
import VideoAnnotator from '../../../components/subtitling/VideoAnnotator'; 
import VideoControls from '../../../components/subtitling/VideoControls';
import TimelineSlider from '../../../components/subtitling/timelineSlider';
import play from '../../../public/img/icons/play-white.svg';
import Image from 'next/image';
import FormInput from '../../../components/FormComponents/FormInput';
import CustomSelectInput from '../../../components/FormComponents/CustomSelectInput';
import Caption from '../../../components/subtitling/Caption';
import Button from '../../../components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Loader from '../../../components/UI/Loader';
import trash from '/public/img/icons/trash.svg';
import plus from '/public/img/icons/plus.svg';
import ErrorHandler from '../../../utils/errorHandler';
import { verifyTranslator } from '../../api/firebase/index';
import { useRouter } from 'next/router';
import { getDownloadLink } from '../../../services/apis'


const shorts_subtitling = () => {
    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null);
    const [addRectangle, setAddRectangle] = useState(false);
    const [rectangles, setRectangles] = useState([]);
    const [selectedRectIndex, setSelectedRectIndex] = useState(null);
    const [captionsArray, setCaptionsArray] = useState([]);
    const [rectIndex, setRectIndex] = useState(null);
    const [subtitle, setSubtitle] = useState(false);
    const [subtitleDetails, setSubtitleDetails] = useState(null);
    const [focused, setFocused] = useState(null);

    const router = useRouter();
    const { jobId } = router.query;
    const { translatorId } = router.query;
    const { creatorId } = router.query;

    const handleVerifyTranslator = async () => {
      try{
        // const verify = await verifyTranslator(translatorId, jobId);
        // console.log(verify);
        // if (!verify){
        //   throw new Error("invalid translatorId or JobId");
        // }
      
        const videoPath  = `dubbing-tasks/${creatorId}/${jobId}/video.mp4`;

        const downloadLink = await getDownloadLink(videoPath);

        console.log(downloadLink);
      }catch(error){
        ErrorHandler(error);
      }
    }

    const handleLoadVideo = async () => {

    }

    useEffect(() => {
      handleVerifyTranslator();

    })
  
    const handleAddRectangle = () => {
      setAddRectangle(true);
    };

    const getCaptionByIndex = (index) => {
      return captionsArray[index];
    }

    const handleCreateSubtitle = () => {
      if (subtitle){
        return;
      }

      setSubtitle(true);

      let index = rectangles.length;

      if (!index){
        index = 0
      }

      handleAddRectangle();

      let subtitleDetails = {
        index:index,
        start: "",
        font: "Arial",
        fontColor: "white",
        outline:"black",
        background: "blurred",
      }

      setSubtitleDetails(subtitleDetails);
      setRectIndex(index);
      setFocused(index);
      

    }

    const handleClickSubtitle = () => {
      if (!subtitle){
        return;
      }else{
        setRectIndex(subtitleDetails.index);
      }
    }

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


    }


    const handleCreateCaption = () => {
      let index = rectangles.length;

      if (!index){
        index = 0
      }

      handleAddRectangle();

      let captionDetails = {
        start: "",
        end: "",
        text: "",
        type: "Normal Caption",
        font: "Arial",
        fontColor: "black",
        background: "white",
      }

      setCaptionsArray([...captionsArray, {index: index, captionDetails: captionDetails}]);

      setRectIndex(index);
      setFocused(index);

    }

    useEffect(() =>{
      console.log(rectIndex);
      console.log(subtitle);
    },[rectIndex,subtitle])
  
    return (
      <>
      <PageTitle title="Captioning & Subtitling" />
  <div className="flex flex-col h-screen">
    {/* First two sections with calculated height */}
    <video ref={hiddenVideoRef} style={{ height: 'calc(100vh - 260px)',display:'none' }}>
        <source src="https://www.pexels.com/download/video/4832723/" type="video/mp4" />
    </video>
    <div className="flex flex-row px-s5" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="w-2/3 flex justify-center">
        <div className="flex items-center">
          <VideoAnnotator 
            videoUrl="https://www.pexels.com/download/video/4832723/" 
            videoRef={videoRef} 
            addRectangle={addRectangle} 
            onRectangleAdded={() => setAddRectangle(false)}
            rectIndex={rectIndex}
            setRectIndex={setRectIndex}
            rectangles={rectangles}
            setRectangles={setRectangles} 
          />
        </div>
      </div>
      <div className="w-1/3 pr-s2" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="ml-s5 mt-s5 overflow-y-auto h-full w-full">
          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2">
            <div className="flex flex-col justify-center">
              <div className="flex flex-row items-center">
                <div className="flex-shrink-0 flex-grow-0">
                <Image src={play} alt="" width={40} height={40} />
                </div>

                <div className= "ml-s2">
                  <div className="text-white text-lg">
                  Logan Paul and KSI Surprise Fans With Prime Energy 
                  </div>

                  <div className="text-white text-opacity-75 text-sm mt-[4px]">
                  Logan Paul
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 justify-center gap-s2 mt-s2">
              <Button
                theme="error"
                classes="flex justify-center items-center h-[48px]"
                onClick={() => handleApprove()}
                //isLoading={loader === 'approve'}
              >
                <span className="mr-2">Flag</span>
              </Button>

              <Button
                  theme="success"
                  classes="flex justify-center items-center h-[48px]"
                  onClick={() => handleApprove()}
                  //isLoading={loader === 'approve'}
              >
                  <span className="mr-2">Approve</span>
                  <Image src={Check} alt="" width={24} height={24} />
              </Button>
              </div>
            </div>
          </div>

          <div className="px-s2 pt-s2 pb-s1 bg-white-transparent rounded-2xl mb-s2 flex flex-col justify-center cursor-pointer" onClick={handleCreateCaption}>
            <div className="relative">
              <div className={`float-left text-white text-2xl font-bold mt-[2px]`}>
                Captions
              </div>

              <div className="float-right">
                <Image src={plus} alt="" width={30} height={30}/>
              </div>
            </div>
          </div>

          <div>
            {captionsArray.map((caption,i) => (

              <Caption key={i} captionKey={i} captionsArray={captionsArray} setCaptionsArray={setCaptionsArray} index={caption.index} setRectIndex={setRectIndex} rectIndex={rectIndex} rectangles={rectangles} setRectangles={setRectangles} focused={focused} setFocused={setFocused}/>

            ))}
          </div>

          <div className={`px-s2 pt-s2 pb-s1 bg-white-transparent rounded-2xl mb-s2 flex flex-col justify-center ${subtitle ? "" : "cursor-pointer"} ${(subtitleDetails && focused==subtitleDetails.index) ? "border-solid border-white border-2" : ""}`} onClick={()=>{handleClickSubtitle();handleCreateSubtitle();if(subtitleDetails){setFocused(subtitleDetails.index)};console.log(focused)}}>
            <div className="relative">
              <div className='float-left text-white text-2xl font-bold mt-[2px]'>
                Subtitles
              </div>

              {subtitle &&
              <div className="float-right">
                <Image src={trash} alt="" width={30} height={30} onClick={handleDeleteSubtitle}/>
              </div>
              }

              {!subtitle &&
              <div className="float-right">
                <Image src={plus} alt="" width={30} height={30}/>
              </div>
              }
            </div>
            {subtitle &&
            <div>
              <div className="text-white text-lg mt-s2 font-bold">Time</div>

              <div className="flex flex-row items-center mt-s2">
                <FormInput
                  label="Start time"
                  placeholder="00:00:00"
                  value=""
                  onChange={(e) => setName(e.target.value)}      
                  name="title"
                  labelClasses="text-lg text-white !mb-s1"
                  valueClasses="placeholder-white text-lg font-light"
                  classes="!mb-s2 !mr-s1"
                />
              </div>

              <div className="w-full h-[1px] bg-white-transparent"/>

              <div className="text-white text-lg mt-s2 font-bold">Text style</div>

              <CustomSelectInput
                text="Font"
                value="Arial"
                options={['Normal caption','Comment caption']}
                onChange={(selectedOption) => setCountry(selectedOption)}
                labelClasses="text-lg text-white !mb-s1"
                valueClasses="text-lg !text-white ml-s1 font-light"
                classes="!mb-s2 !mt-s2"
              />

              <CustomSelectInput
                text="Font color"
                value="Red"
                options={['Normal caption','Comment caption']}
                onChange={(selectedOption) => setCountry(selectedOption)}
                labelClasses="text-lg text-white !mb-s1"
                valueClasses="text-lg !text-white ml-s1 font-light"
                classes="!mb-s2"
              />  

              <CustomSelectInput
                text="Text Outline"
                value="Red"
                options={['Normal caption','Comment caption']}
                onChange={(selectedOption) => setCountry(selectedOption)}
                labelClasses="text-lg text-white !mb-s1"
                valueClasses="text-lg !text-white ml-s1 font-light"
                classes="!mb-s2"
              />  

              <CustomSelectInput
                text="Background"
                value="Red"
                options={['Normal caption','Comment caption']}
                onChange={(selectedOption) => setCountry(selectedOption)}
                labelClasses="text-lg text-white !mb-s1"
                valueClasses="text-lg !text-white ml-s1 font-light"
                classes="!mb-0"
              />
            </div>}
          </div>



        </div>
    </div>
    </div>

    {/* Third section */}
    <div className="w-full h-[180px] bg-white-transparent">
      <TimelineSlider videoRef={videoRef} hiddenVideoRef={hiddenVideoRef}/>
    </div>
  </div>
</>

    );
  };
  
  export default shorts_subtitling;