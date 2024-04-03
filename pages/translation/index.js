import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import SelectedVideo from '../../components/translation/SelectedVideo-Translation';
import AllVideos from '../../components/admin/AllVideos';
import Logo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import { getAllPendingTranslations } from '../../services/firebase';

const Transcription = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(undefined);

  const callback = (data) => {
    const pending = data
      ? Object.values(data).map((item, i) => ({
          ...item,
          jobId: Object.keys(data)[i],
        }))
      : [];
    setJobs(pending);
  };

  const getPendingJobs = async () => {
    await getAllPendingTranslations(callback);
  };

  useEffect(() => {
    getPendingJobs();
  }, []);

  return (
    <>
      <PageTitle title="Translation" />
      <div className="flex text-white">
        <div className="w-1/2 rounded-md bg-white-transparent">
          <h2 className="p-s2">Videos Selection</h2>
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <AllVideos
                key={i}
                job={job}
                setSelectedJob={setSelectedJob}
                selectedJob={selectedJob}
              />
            ))
          ) : (
            <p className="mt-s3 text-center text-xl">
              Nothing to see here folks, come back later
            </p>
          )}
        </div>
        {selectedJob ? (
          <div className="ml-s3 w-1/2">
            <SelectedVideo
              selectedJob={selectedJob}
              setSelectedJob={setSelectedJob}
            />
          </div>
        ) : (
          <div className="flex w-1/2 items-start justify-center pt-s10">
            <Image src={Logo} alt="" />
          </div>
        )}
      </div>
    </>
  );
};

Transcription.getLayout = DashboardLayout;

export default Transcription;
