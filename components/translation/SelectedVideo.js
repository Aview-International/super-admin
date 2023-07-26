import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import OnboardingButton from '../Onboarding/button';
import { downloadSrtFile, approveTranslation } from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Download from '../../public/img/icons/download.svg';
import Upload from '../../public/img/icons/upload.svg';
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
    // console.log(selectedJob.creatorId, date, key);
    // console.log(creatorId, date, s3ObjectKey);
    approveTranslation(
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

          {vid.translatedLanguageKeys &&
            vid.translatedLanguageKeys.map((lang, i) => (
              <div className="my-s3" key={i}>
                <p>{lang.split('-')[0].substring(5)}</p>
                <div className="grid grid-cols-3 justify-center gap-s2">
                  <OnboardingButton
                    theme="light"
                    classes="flex justify-center items-center"
                    onClick={() => handleDownload(vid.date, lang)}
                  >
                    <span className="mr-2">Download</span>
                    <Image src={Download} alt="" width={22} height={22} />
                  </OnboardingButton>

                  <OnboardingButton
                    theme="light"
                    classes="flex justify-center items-center"
                  >
                    <span className="mr-2">Upload</span>
                    <Image src={Upload} alt="" width={22} height={22} />
                  </OnboardingButton>
                  <OnboardingButton
                    theme="success"
                    classes="flex justify-center items-center"
                    onClick={() => handleApproval(vid.date, lang)}
                  >
                    <span className="mr-2">Approve</span>
                    <Image src={Check} alt="" width={24} height={24} />
                  </OnboardingButton>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedVideo;
