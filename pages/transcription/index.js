import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import VideoPlayer from '../../components/admin/VideoPlayer';
import VideoDetails from '../../components/admin/VideoDetails';
import { TranscriptionVideoFiles } from '../../components/admin/VideoData';

const Transcription = () => {
  return (
    <>
      <PageTitle title="Transcription" />
      <div className="gradient-dark rounded-2xl p-s3">
        <VideoDetails name="Transcription" />
        <div className="mt-s5 flex text-white">
          <div className="w-1/2">
            <VideoPlayer />
          </div>
          <div className="w-1/2">
            <TranscriptionVideoFiles />
          </div>
        </div>
      </div>
    </>
  );
};

Transcription.getLayout = DashboardLayout;

export default Transcription;
