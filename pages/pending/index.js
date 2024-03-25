import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getAllJobsUnderReview } from '../api/firebase';
import SelectedVideo from '../../components/pending/SelectedVideo-Pending';
import AllVideos from '../../components/admin/AllVideos';
import Image from 'next/image';
import Logo from '../../public/img/aview/logo.svg';

const Transcription = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [videoDownloadLink, setVideoDownloadLink] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const callback = (data) => {
    const pending = data
      ? Object.values(data).map((item, i) => ({
          ...item,
          jobId: Object.keys(data)[i],
        }))
      : [];
    setJobs(pending);
    console.log(pending);
  };

  const getPendingJobs = async () => {
    await getAllJobsUnderReview(callback);
  };

  useEffect(() => {
    getPendingJobs();
  }, [updateTrigger]);

  console.log(jobs);

  return (
    <>
      <PageTitle title="Transcription" />
      <div className="flex text-white">
        <div className="w-1/2 rounded-md bg-white-transparent">
          <h2 className="p-s2">Pending Videos</h2>
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <AllVideos
                job={job}
                key={i}
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                setVideoDownloadLink={setVideoDownloadLink}
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
              videoDownloadLink={videoDownloadLink}
              triggerUpdate={() => setUpdateTrigger(prev => !prev)}
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
