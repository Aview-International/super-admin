import { useEffect, useState, useRef } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import VideoAnnotator from '../../components/subtitling/VideoAnnotator'; 
import VideoControls from '../../components/subtitling/VideoControls';
import TimelineSlider from '../../components/subtitling/timelineSlider';


// const shorts_subtitling = () => {
//     const [addRectangle, setAddRectangle] = useState(false);
  
//     const handleAddRectangle = () => {
//       setAddRectangle(true);
//     };
  
//     return (
//       <>
//         <PageTitle title="Shorts Subtitling" />
//         <div>
//           <VideoAnnotator 
//             videoUrl="https://www.pexels.com/download/video/1321208/"
//             addRectangle={addRectangle}
//             onRectangleAdded={() => setAddRectangle(false)} 
//           />
//         </div>
//         <button onClick={handleAddRectangle}>Add Rectangle</button>
//       </>
//     );
// };

// export default shorts_subtitling;


const shorts_subtitling = () => {
    const videoRef = useRef(null);
    const [addRectangle, setAddRectangle] = useState(false);
  
    const handleAddRectangle = () => {
      setAddRectangle(true);
    };
  
    return (
      <>
        <VideoAnnotator videoUrl="https://www.pexels.com/download/video/1321208/" videoRef={videoRef} addRectangle={addRectangle} onRectangleAdded={() => setAddRectangle(false)} />
        <VideoControls videoRef={videoRef} />
        <TimelineSlider videoRef={videoRef}/>
        <button className='bg-white' onClick={handleAddRectangle}>Add Rectangle</button>
      </>
    );
  };
  
  export default shorts_subtitling;