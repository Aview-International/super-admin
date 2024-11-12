import React, { useState, useEffect } from 'react';
import Button from './Button';
import { addTime, clearOverdueJobFromTimer } from '../../services/apis';
import { toast } from 'react-toastify';
import SuccessHandler from '../../utils/successHandler';

const Timer = ({ jobId, jobType, setIsLoading, jobTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState(3600);

  const resetTimer = () => {
    setTimeLeft(3600);
    addTime(jobId, jobType);
    SuccessHandler('Added more time');
  };

  const startingTime = () => {
    const now = Date.now();
    const remainingTime = Math.ceil((jobTimestamp + 3600000 - now) / 1000);
    setTimeLeft(remainingTime);
  };

  const onCountdownEnd = () => {
    clearOverdueJobFromTimer(jobId, jobType);
    setIsLoading(true);
    toast.error('Job Expired', { autoClose: false });
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
    <div className="z-50 flex w-[170px] flex-col items-center justify-center rounded-2xl bg-white-transparent py-s1.5 px-s2 text-2xl text-white">
      <div className="mb-s1 text-lg">{formatTimeLeft()}</div>
      <Button
        theme=""
        classes="flex justify-center items-center h-[30px] !px-s1"
        onClick={resetTimer}
      >
        <span className="text-base text-black">Add time</span>
      </Button>
    </div>
  );
};

export default Timer;
