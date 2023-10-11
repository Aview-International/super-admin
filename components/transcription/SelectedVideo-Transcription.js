import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import Button from '../UI/Button';
import { approveSrt, downloadS3Object } from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Image from 'next/image';

const SelectedVideo = ({ selectedJob, setSelectedJob }) => {
  console.log(selectedJob);
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

  const handleDownload = async (date, key) => {
    setLoader('download');
    const { data } = await downloadS3Object(
      date,
      key,
      selectedJob.creatorId,
      'srt'
    );
    setLoader('');
    window.open(data, '_blank');
  };

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
    }
  };

  return (
    <div className="rounded-md bg-white-transparent p-s2">
      {selectedJob.videoData.map((vid, i) => (
        <div key={i}>
          <h2 className="text-2xl font-semibold">{vid.caption}</h2>
          <p className="my-s2 text-lg font-medium">{creatorData.name}</p>

          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${vid.id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          <div className="my-s3 grid grid-cols-3 gap-s2">
            <Button
              theme="light"
              onClick={() => handleDownload(vid.date, vid.objectS3Key)}
              isLoading={loader === 'download'}
            >
              Download
            </Button>
            <Button theme="dark">Upload</Button>
            <Button
              theme="success"
              classes="flex items-center"
              onClick={() => handleApproval(vid.objectS3Key)}
              isLoading={loader === 'approve'}
            >
              <Image src={Check} alt="" width={24} height={24} />
              <span className="ml-2">Approve</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedVideo;
