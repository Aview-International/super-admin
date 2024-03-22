import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import VideoAnnotator from '../../components/subtitling/VideoAnnotator'; 
import VideoControls from '../../components/subtitling/VideoControls';
import TimelineSlider from '../../components/subtitling/timelineSlider';
import play from '../../public/img/icons/play-white.svg';
import Image from 'next/image';
import FormInput from '../../components/FormComponents/FormInput';
import Textarea from '../../components/FormComponents/Textarea';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import Caption from '../../components/subtitling/Caption';
import Button from '../../components/UI/Button';
import Check from '/public/img/icons/check-circle-green.svg';
import Loader from '../../components/UI/Loader';
import trash from '/public/img/icons/trash.svg'


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
      

    }

    const handleClickSubtitle = () => {
      if (!subtitle){
        return;
      }else{
        setRectIndex(subtitleDetails.index);
      }
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
    <video ref={hiddenVideoRef} style={{ height: 'calc(100vh - 280px)',display:'none' }}>
        <source src="https://www.pexels.com/download/video/4832723/" type="video/mp4" />
    </video>
    <div className="flex flex-row px-s5" style={{ height: 'calc(100vh - 200px)' }}>
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
      <div className="w-1/3 overflow-y-auto">
        <div className="ml-s5 mt-s5">
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

          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex" onClick={handleCreateCaption}>
            <div className={`float-left text-white text-2xl font-bold`}>
              Captions
            </div>
          </div>

          <div>
            {captionsArray.map((caption,i) => (

              <Caption key={i} captionKey={i} captionsArray={captionsArray} setCaptionsArray={setCaptionsArray} index={caption.index} setRectIndex={setRectIndex} rectIndex={rectIndex}/>

            ))}
          </div>

          {/* <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex">
            <div className='float-left text-white text-xl'>
              Subtitles
            </div>
          </div> */}

          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex flex-col" onClick={()=>{handleClickSubtitle();handleCreateSubtitle();}}>
            <div className="relative">
              <div className='float-left text-white text-2xl font-bold'>
                Subtitles
              </div>

              {subtitle &&
              <div className="float-right">
                <Image src={trash} alt="" width={30} height={30} className=""/>
              </div>}
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
    <div className="w-full h-[200px] bg-white-transparent">
      <TimelineSlider videoRef={videoRef} hiddenVideoRef={hiddenVideoRef}/>
    </div>
  </div>
</>

    );
  };
  
  export default shorts_subtitling;