import { useEffect } from 'react';
import Button from '../UI/button';

const VideoUpload = ({
  setVideoFile,
  videoFile,
  closeModal,
  handleVideoUpload,
}) => {
  useEffect(() => {
    setVideoFile(undefined);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-screen overflow-hidden">
      <div className="fixed top-1/2 left-1/2 flex h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-black text-center">
        <div>
          <label className="block text-xl">Select Video</label>
          <input
            type="file"
            accept="video/*"
            className="mx-auto my-s3 block"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          <div className="flex gap-s3">
            <Button theme="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              theme="light"
              disabled={!videoFile}
              onClick={handleVideoUpload}
            >
              Upload Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
