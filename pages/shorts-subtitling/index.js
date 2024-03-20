import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import VideoAnnotator from '../../components/subtitling/VideoAnnotator'; 
import VideoControls from '../../components/subtitling/VideoControls';
import TimelineSlider from '../../components/subtitling/timelineSlider';
import play from '../../public/img/icons/play-white.svg';
import Image from 'next/image';


const shorts_subtitling = () => {
    const videoRef = useRef(null);
    const [addRectangle, setAddRectangle] = useState(false);
  
    const handleAddRectangle = () => {
      setAddRectangle(true);
    };
  
    return (
      // <>
      //   <div className="flex flex-col h-screen">
      //     {/*first two sections*/}
      //     <div className="flex flex-row flex-grow">
      //       <div className="w-1/2 ">
      //         <VideoAnnotator videoUrl="https://www.pexels.com/download/video/8859849/" videoRef={videoRef} addRectangle={addRectangle} onRectangleAdded={() => setAddRectangle(false)} />
      //       </div>
      //       <div className="w-1/2">
      //       <button className='bg-white' onClick={handleAddRectangle}>Add Rectangle</button>
      //       </div>
      //     </div>

      //     {/*third section*/}
      //     <div className="w-full h-[200px]">
      //     <TimelineSlider videoRef={videoRef}/>
      //     <VideoControls videoRef={videoRef} />
      //     </div>
      //   </div>
        
      // </>

      <>
  <div className="flex flex-col h-screen">
    {/* First two sections with calculated height */}
    <div className="flex flex-row px-s5" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="w-2/3 flex justify-center">
        <div className="flex items-center">
        <VideoAnnotator videoUrl="https://www.pexels.com/download/video/8859849/" videoRef={videoRef} addRectangle={addRectangle} onRectangleAdded={() => setAddRectangle(false)} />
        </div>
      </div>
      <div className="w-1/3">
        <div className="ml-s5 mt-s5">
          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2">
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
          </div>

          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex">
            <div className='float-left text-white text-xl'>
              Captions
            </div>
          </div>

          <div className="p-s2 bg-white-transparent rounded-2xl mb-s2 flex">
            <div className='float-left text-white text-xl'>
              Subtitles
            </div>
          </div>
        </div>
        <button className='bg-white' onClick={handleAddRectangle}>Add Rectangle</button>
      </div>
    </div>

    {/* Third section */}
    <div className="w-full h-[200px] bg-white-transparent">
      <TimelineSlider videoRef={videoRef}/>
    </div>
  </div>
</>

    );
  };
  
  export default shorts_subtitling;