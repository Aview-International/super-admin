import React, { useState, useEffect, useRef } from 'react';
import styles from './TimelineSlider.module.css';

const TimelineSlider = ({ videoRef }) => {
  const [value, setValue] = useState(0);
  const [canvases, setCanvases] = useState([]);
  const canvasRefs = useRef([]);

  const captureThumbnails = () => {
    if (!videoRef.current) return;

    const duration = videoRef.current.duration;
    const interval = duration / 20;
    let captures = [];
    let currentTime = 0;

    const capture = () => {
      if (currentTime <= duration && captures.length < 20) {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        captures.push(canvas);
        currentTime += interval;
        if (currentTime <= duration && captures.length < 20) {
          videoRef.current.currentTime = currentTime;
        } else {
          setCanvases(captures);
          canvasRefs.current = captures.map((_, i) => canvasRefs.current[i] || React.createRef());
        }
      }
    };

    videoRef.current.addEventListener('seeked', capture);
    videoRef.current.currentTime = currentTime;
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', captureThumbnails);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', captureThumbnails);
        videoRef.current.removeEventListener('seeked', capture);
      }
    };
  }, [videoRef]);

  useEffect(() => {
    // Insert each canvas into its corresponding div after the component has rendered
    canvases.forEach((canvas, index) => {
      if (canvasRefs.current[index]) {
        canvasRefs.current[index].current.appendChild(canvas);
      }
    });
  }, [canvases]);

  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  return (
    <div className={styles.timeline_container}>
      <input
        type="range"
        min="0"
        max="3600"
        value={value}
        className={styles.timeline_slider}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className={styles.time_indicator}>
        {formatTime(value)} / {formatTime(3600)}
      </div>
      <div className={styles.thumbnail_container}>
        {canvases.map((_, index) => (
          <div key={index} ref={canvasRefs.current[index]} className={styles.canvas_thumbnail} style={{ width: '5%', height: 'auto' }}>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSlider;












