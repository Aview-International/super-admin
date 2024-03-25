import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import { approveSrt, downloadS3Object } from '../../services/apis';
import Button from '../UI/Button';
import ReactPlayer from 'react-player';
import Check from '../../public/img/icons/check-circle-green.svg';
import Image from 'next/image'
import { completeJob } from '../../services/apis';
import successHandler from '../../utils/successHandler';



const SelectedVideo = ({ selectedJob, setSelectedJob, videoDownloadLink, triggerUpdate }) => {
  const [loader, setLoader] = useState('');

  const handleApproval = async () => {
    setLoader('approve');
    await completeJob(selectedJob.creatorId, selectedJob.timestamp).then(() => {
      setLoader('');
      triggerUpdate();
      setSelectedJob(undefined);
      successHandler("Approved!")
  });
  }


  return (
    <div className="rounded-md bg-white-transparent p-s2 flex flex-col justify-center items-center">
      <div className="w-full mb-s1 text-xl">
        <div className="float-left">{selectedJob.videoData.caption}</div>
      </div>
      <div style={{ width: '100%', maxWidth: '775px', aspectRatio: '16 / 9', backgroundColor: 'black'}}>
        <ReactPlayer url={videoDownloadLink} controls width="100%" height="100%" />
      </div>
      <div className="w-full flex flex-col justify-center">
        <Button
          theme="success"
          classes="flex flex-col justify-center items-center  mt-s2"
          onClick={() => handleApproval()}
          isLoading={loader === 'approve'}
        >
          <div className="flex flex-row items-center">
            <Image src={Check} alt="" width={24} height={24} />
            <span className="ml-s1">Approve</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SelectedVideo;
