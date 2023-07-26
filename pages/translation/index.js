import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getAllPendingTranslations } from '../api/firebase';
import SelectedVideo from '../../components/translation/SelectedVideo';
import AllVideos from '../../components/admin/AllVideos';

const Transcription = () => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [modalIndex, setModalIndex] = useState(undefined);
  const [jobs, setJobs] = useState([]);

  const [selectedJob, setSelectedJob] = useState(undefined);

  const getPendingJobs = async () => {
    const res = await getAllPendingTranslations();
    console.log(res);
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
      <div className="flex text-white">
        <div className="w-1/2 rounded-md bg-white-transparent">
          <h2 className="p-s2">Videos Selection</h2>
          {jobs.map((job, i) => (
            <AllVideos
              job={job}
              key={i}
              setSelectedJob={setSelectedJob}
              selectedJob={selectedJob}
            />
          ))}
        </div>
        {selectedJob && (
          <div className="ml-s3 w-1/2">
            <SelectedVideo selectedJob={selectedJob} />
          </div>
        )}
      </div>
    </>
  );
};

Transcription.getLayout = DashboardLayout;

export default Transcription;
