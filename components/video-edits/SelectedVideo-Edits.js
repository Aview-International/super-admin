import { useEffect, useState } from 'react';
import { getUserProfile } from '../../pages/api/firebase';
import Button from '../UI/Button';
import {
  downloadS3Object,
  downloadYoutubeVideo,
  uploadFinalVideo,
} from '../../services/apis';
import Download from '../../public/img/icons/download.svg';
import Upload from '../../public/img/icons/upload.svg';
import Image from 'next/image';
import VideoUpload from '../dubbing/VideoUpload';

const SelectedVideo = ({ selectedJob, setSelectedJob }) => {
  console.log(selectedJob);
  const [uploadModal, setUploadModal] = useState(false);
  const [videoFile, setVideoFile] = useState(undefined);
  const [button, setButton] = useState('');
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
    setButton(key);
    setLoader('download');
    const { data } = await downloadS3Object(
      date,
      key,
      selectedJob.creatorId,
      'audio'
    );
    setLoader('');
    window.open(data, '_blank');
  };

  const handleYoutubeDownload = async (id) => {
    try {
      setLoader('download-youtube');
      await downloadYoutubeVideo(id);
      setLoader('');
    } catch (error) {
      setLoader('');
    }
  };

  const handleVideoUploadModal = () => {
    setUploadModal(true);
  };

  const closeModal = () => setUploadModal(false);

  const handleVideoUpload = async (date, objectS3Key, dubbedAudioKey) => {
    try {
      const res = await uploadFinalVideo(
        videoFile,
        selectedJob.jobId,
        objectS3Key,
        date,
        selectedJob.creatorId,
        dubbedAudioKey
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-md bg-white-transparent p-s2">
      {selectedJob.videoData.map((vid, i) => (
        <div key={i}>
          <h2 className="text-2xl font-semibold">{vid.caption}</h2>
          <p className="my-s2 text-lg font-medium">{creatorData.name}</p>

          <div className="my-s3 w-[300px]">
            <Button
              theme={'light'}
              isLoading={loader === 'download-youtube'}
              onClick={() => handleYoutubeDownload(vid.id)}
            >
              Download Original Video
            </Button>
          </div>

          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${vid.id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          <p className="my-s3 text-xl">Audio files</p>
          {vid.dubbedAudioKeys &&
            vid.dubbedAudioKeys.map((dubbedAudioKey, i) => (
              <div className="mb-s3" key={i}>
                {uploadModal && (
                  <VideoUpload
                    setVideoFile={setVideoFile}
                    videoFile={videoFile}
                    closeModal={closeModal}
                    handleVideoUpload={() =>
                      handleVideoUpload(
                        vid.date,
                        vid.objectS3Key,
                        dubbedAudioKey
                      )
                    }
                  />
                )}

                <p>{dubbedAudioKey.split('-')[0].substring(5)} - Audio</p>
                <div className="grid grid-cols-2 justify-center gap-s2">
                  <Button
                    theme="light"
                    classes="flex justify-center items-center"
                    onClick={() => handleDownload(vid.date, dubbedAudioKey)}
                    isLoading={
                      loader === 'download' && button === dubbedAudioKey
                    }
                  >
                    <span className="mr-2">Download</span>
                    <Image src={Download} alt="" width={22} height={22} />
                  </Button>

                  <Button
                    theme="dark"
                    classes="flex justify-center items-center"
                    onClick={() => handleVideoUploadModal()}
                    isLoading={
                      loader === 'approve' && button === dubbedAudioKey
                    }
                  >
                    <span className="mr-2">Upload Final Video</span>
                    <Image
                      src={Upload}
                      alt=""
                      width={24}
                      height={24}
                      className="brightness-0 invert"
                    />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedVideo;
