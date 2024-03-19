// import React, { useState, useEffect } from 'react';

// const VideoControls = ({ videoRef }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     setDuration(videoRef.current?.duration || 0);
//   }, [videoRef]);

//   useEffect(() => {
//     console.log(videoRef.current); // This should output the video DOM element after mounting
//   }, [videoRef]);

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleTimeUpdate = () => {
//     setCurrentTime(videoRef.current?.currentTime || 0);
//   };

//   // Sync time update
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
//       return () => {
//         videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//       };
//     }
//   }, [videoRef]);

//   return (
//     <div>
//       <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
//       <input
//         type="range"
//         min="0"
//         max={duration}
//         value={currentTime}
//         onChange={(e) => {
//             const time = Number(e.target.value);
//             videoRef.current.currentTime = time;
//             setCurrentTime(time);
//           }}
//       />
//       <span>{Math.round(currentTime)} / {Math.round(duration)}</span>
//     </div>
//   );
// };

// export default VideoControls;

import React, { useState, useEffect } from 'react';

const VideoController = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const video = videoRef.current;
    const updateDuration = () => {
      setDuration(video.duration);
    };

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateTime);

    return () => {
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('timeupdate', updateTime);
    };
  }, [videoRef]);

  return (
    <div>

      <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        step="0.01"
        onInput={handleTimeChange}
        className="w-[300px] h-[40px]"
        />
    </div>
  );
};

export default VideoController;