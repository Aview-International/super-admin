import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import VideoAnnotator from '../../components/subtitling/VideoAnnotator'; 
import VideoControls from '../../components/subtitling/VideoControls';
import TimelineSlider from '../../components/subtitling/timelineSlider';


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
    <div className="flex flex-row" style={{ height: 'calc(100vh - 300px)' }}>
      <div className="w-1/2 flex justify-center bg-white">
        <VideoAnnotator videoUrl="https://www.pexels.com/download/video/8859849/" videoRef={videoRef} addRectangle={addRectangle} onRectangleAdded={() => setAddRectangle(false)} />
      </div>
      <div className="w-1/2">
        <button className='bg-white' onClick={handleAddRectangle}>Add Rectangle</button>
      </div>
    </div>

    {/* Third section */}
    <div className="w-full" style={{ height: '200px' }}>
      <TimelineSlider videoRef={videoRef}/>
      <VideoControls videoRef={videoRef} />
    </div>
  </div>
</>

    );
  };
  
  export default shorts_subtitling;