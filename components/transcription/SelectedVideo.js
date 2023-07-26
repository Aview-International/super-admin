import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import OnboardingButton from '../Onboarding/button';
import { approveSrt, downloadSrtFile } from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Cancel from '../../public/img/icons/cancel-white.svg';
import Image from 'next/image';

const SelectedVideo = ({ selectedJob }) => {
  console.log(selectedJob);
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
    const { data } = await downloadSrtFile(date, key, selectedJob.creatorId);
    window.open(data, '_blank');
  };

  const handleApproval = (date, key) => {
    approveSrt(
      selectedJob.jobId,
      date,
      key,
      selectedJob.creatorId,
      selectedJob.languages
    );
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

          <div className="my-s3 grid grid-cols-2 gap-s2">
            <OnboardingButton
              theme="dark"
              onClick={() => handleDownload(vid.date, vid.objectS3Key)}
            >
              Download
            </OnboardingButton>
            <OnboardingButton theme="light">Upload</OnboardingButton>
            <OnboardingButton
              theme="success"
              classes="flex items-center"
              onClick={() => handleApproval(vid.date, vid.objectS3Key)}
            >
              <Image src={Check} alt="" width={24} height={24} />
              <span className="ml-2">Approve</span>
            </OnboardingButton>
            <OnboardingButton theme="error" classes="flex items-center">
              <Image src={Cancel} alt="" width={24} height={24} />
              <span className="ml-2">Decline</span>
            </OnboardingButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedVideo;
