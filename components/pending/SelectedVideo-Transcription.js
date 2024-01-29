import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import { approveSrt, downloadS3Object } from '../../services/apis';

import S3VideoPlayer from '../admin/S3VideoPlayer';
import ErrorHandler from '../../utils/errorHandler';
import YoutubePlayer from './YoutubePlayer';

const SelectedVideo = ({ selectedJob, setSelectedJob }) => {
  const [loader, setLoader] = useState('');
  const [creatorData, setCreatorData] = useState({
    name: '',
    picture: '',
  });

  const getProfile = async () => {
    const res = await getUserProfile(selectedJob.creatorId);
    setCreatorData({
      name: res?.firstName + ' ' + res?.lastName,
      picture: res?.picture,
    });
  };

  useEffect(() => {
    getProfile();
  }, [selectedJob.creatorId]);

  const handleApproval = async (key) => {
    setLoader('approve');
    try {
      await approveSrt(
        selectedJob.jobId,
        selectedJob.date,
        key,
        selectedJob.creatorId,
        selectedJob.languages
      );
      setSelectedJob(undefined);
      setLoader('');
    } catch (error) {
      setLoader('');
      ErrorHandler(error);
      console.log(error);
    }
  };

  return (
    <div className="rounded-md bg-white-transparent p-s2">
      {selectedJob.videoData.map((vid, i) =>
        vid.type === 'uploaded' ? (
          <S3VideoPlayer
            key={i}
            creatorData={creatorData}
            vidData={vid}
            loader={loader}
            selectedJob={selectedJob}
            setLoader={setLoader}
          />
        ) : vid.type === 'youtube' ? (
          <YoutubePlayer
            key={i}
            creatorData={creatorData}
            selectedJob={selectedJob}
            vidData={vid}
            loader={loader}
            setLoader={setLoader}
          />
        ) : null
      )}
    </div>
  );
};

export default SelectedVideo;
