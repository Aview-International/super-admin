import React, { useState, useEffect, useRef } from 'react';
import styles from './TimelineSlider.module.css';
import play from '../../public/img/icons/play-white.svg';
import Image from 'next/image';

const TimelineSlider = ({ videoRef, hiddenVideoRef }) => {
  const [canvases, setCanvases] = useState([]);
  const canvasRefs = useRef([]);
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
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const video = videoRef.current;
    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [videoRef]);

  useEffect(() => {
    let animationFrameId;

    const updateSlider = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateSlider);
    };

    updateSlider();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef]);

  const captureThumbnails = () => {
    if (!hiddenVideoRef.current) return;

    const duration = hiddenVideoRef.current.duration;
    const interval = duration / 20;
    let captures = [];
    let currentTime = 0;

    const capture = () => {
      if (currentTime <= duration && captures.length < 20) {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const context = canvas.getContext('2d');
        context.drawImage(hiddenVideoRef.current, 0, 0, canvas.width, canvas.height);
        captures.push(canvas);
        currentTime += interval;
        if (currentTime <= duration && captures.length < 20) {
          hiddenVideoRef.current.currentTime = currentTime;
        } else {
          setCanvases(captures);
          canvasRefs.current = captures.map((_, i) => canvasRefs.current[i] || React.createRef());
        }
      }
    };

    hiddenVideoRef.current.addEventListener('seeked', capture);
    hiddenVideoRef.current.currentTime = currentTime;
  };

  useEffect(() => {
    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.addEventListener('loadeddata', captureThumbnails);
    }

    return () => {
      if (hiddenVideoRef.current) {
        hiddenVideoRef.current.removeEventListener('loadeddata', captureThumbnails);
        hiddenVideoRef.current.removeEventListener('seeked', capture);
      }
    };
  }, [hiddenVideoRef]);

  useEffect(() => {
    canvases.forEach((canvas, index) => {
      if (canvasRefs.current[index]) {
        canvasRefs.current[index].current.appendChild(canvas);
      }
    });
  }, [canvases]);

  const formatTime = (seconds) => {
    const milliseconds = seconds % 1 * 1000;
    const date = new Date(0);
    date.setSeconds(Math.floor(seconds));
    date.setMilliseconds(milliseconds);
    return date.toISOString().substr(11, 11);
  };

  const verticalBarPosition = () => {
    const max = duration;
    return (currentTime / max) * 100 + '%';
  };

    return ( 
    <div className="w-full px-[20px]">
    <div className={styles.timeline_container}>
      <div className="flex justify-center">
        <div className="flex flex-row items-center">
          <Image src={play} onClick={togglePlayPause} alt="" width={24} height={24} />
          <div className={styles.time_indicator}>
            <span>{formatTime(currentTime)}</span> | <span className="text-white text-opacity-75">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        className={styles.timeline_slider}
        onInput={handleTimeChange}
        step="0.01"
      />
        <div className="w-full pl-[5px] pr-[7px]">
          <div className="relative">
          <div
            className={styles.vertical_bar}
            style={{ left: verticalBarPosition() }}
          />
          <div className={styles.thumbnail_container}>
            {canvases.map((_, index) => (
              <div key={index} ref={canvasRefs.current[index]} className="w-5% h-[56px] overflow-hidden">
              </div>
            ))}
          </div>
          </div>
        </div>
        
    </div>
    </div>
  );
};

export default TimelineSlider;











