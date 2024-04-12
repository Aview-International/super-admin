import React, { useState, useEffect } from 'react';
import Button from './Button';
import {
  addTime,
  clearOverdueJobFromTimer
} from '../../services/apis';
import { toast } from 'react-toastify';
import SuccessHandler from '../../utils/successHandler';

const Timer = ({translatorId, jobId, jobType, setIsLoading, jobTimestamp}) => {
  const [timeLeft, setTimeLeft] = useState(3600);

  const resetTimer = () => {
    setTimeLeft(3600);
    addTime(translatorId, jobId, jobType);
    SuccessHandler("Added more time");
  };

  const startingTime = () => {
    const now = Date.now(); 
    const remainingTime = Math.ceil((jobTimestamp + 3600000 - now) / 1000);
    console.log(remainingTime);
    setTimeLeft(remainingTime);
  }

  const onCountdownEnd = () => {
    clearOverdueJobFromTimer(translatorId, jobId, jobType);
    setIsLoading(true);
    toast.error('Job Expired',{autoClose:false});
  };

  useEffect(() => {
    startingTime();
  }, [jobTimestamp]);

  useEffect(() => {
    if (timeLeft == 0) {
      onCountdownEnd();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    let seconds = timeLeft % 60;
    let minutes = Math.floor(timeLeft / 60) % 60;
    let hours = Math.floor(timeLeft / 3600);

    seconds = String(seconds).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    hours = String(hours).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-s2 px-s2 w-[200px] bg-white-transparent rounded-2xl text-white text-2xl z-50">
        <div>{formatTimeLeft()}</div>
        <Button
            theme=""
            classes="flex justify-center items-center h-[28px]"
            onClick={resetTimer}
        >
            <span className="text-lg text-black">Add time</span>
        </Button>
    </div>
  );
};

export default Timer;
