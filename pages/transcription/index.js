import { useState } from 'react';
import AllVideos from '../../components/admin/allVideos';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';

const Transcription = () => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [modalIndex, setModalIndex] = useState(undefined);

  const getPendingJobs = async () => {
    const res = await getAllPendingJobs();
    setJobs(
      res
        ? Object.values(res).map((item, i) => ({
            ...item,
            jobId: Object.keys(res)[i],
          }))
        : []
    );
  };

  useEffect(() => {
    getPendingJobs();
  }, [reloadTrigger]);

  return (
    <>
      <PageTitle title="Transcription" />
      <AllVideos />
    </>
  );
};

Transcription.getLayout = DashboardLayout;

export default Transcription;
