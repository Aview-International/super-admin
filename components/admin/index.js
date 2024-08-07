import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/upload/DashboardLayout'; //from aview-website
import TranslateOptions from '../../components/dashboard/upload/TranslateOptions'; //from aview-website
import UploadVideo from '../../components/dashboard/upload/UploadVideo'; //from aview-website
import PageTitle from '../../components/SEO/PageTitle';
import { uploadCreatorVideo } from '../../services/api.js';
import ErrorHandler from '../../utils/errorHandler.js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { updateRequiredServices } from '../api/firebase/index.js';

const Upload = () => {
  const router = useRouter();
  const userId = useSelector((el) => el.user.uid);
  const [video, setVideo] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0); //show uplaod status
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    languages: '',
    saveSettings: false,
    additionalNote: '',
  });

  const handleSubmit = async () => {
    const preferences = {
      preferences: payload.languages,
      saveSettings: payload.saveSettings,
    };

    try {
      setIsLoading(true);
      if (payload.saveSettings) updateRequiredServices(preferences, userId);
      await uploadCreatorVideo( //pushing content to backend
        video,
        userId,
        payload.languages,
        payload.additionalNote,
        setUploadProgress
      );
      toast.success('Tasks submitted succesfully 🚀');
      setIsLoading(false);
      router.push('/dashboard');
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  return (
    <>
      <PageTitle title="Upload Video" />
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col rounded-xl bg-white-transparent p-s5 text-white lg:flex-row">
          <div className={video ? '' : 'lg:w-full'}>
            <UploadVideo
              setVideo={setVideo}
              video={video}
              uploadProgress={uploadProgress}
            />
          </div>
          <div className={`w-full ${video ? 'lg:ml-s5' : 'lg:mt-0 lg:w-1/2'}`}>
            <TranslateOptions
              handleSubmit={handleSubmit}
              payload={payload}
              setPayload={setPayload}
              isLoading={isLoading}
              uploadProgress={uploadProgress}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Upload.getLayout = DashboardLayout;

export default Upload;
