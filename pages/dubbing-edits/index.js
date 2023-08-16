import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getAllPendingVideoEdits } from '../api/firebase';
import Logo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import AllVideos from '../../components/admin/AllVideos';
import SelectedVideo from '../../components/video-edits/SelectedVideo-Edits';

const VideoEdits = () => {
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
    await getAllPendingVideoEdits(callback);
  };

  useEffect(() => {
    getPendingJobs();
  }, []);

  return (
    <>
      <PageTitle title="Video Edits" />
      <div className="flex text-white">
        <div className="w-1/2 rounded-md bg-white-transparent">
          <h2 className="p-s2">Videos Selection</h2>
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <AllVideos
                job={job}
                key={i}
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

VideoEdits.getLayout = DashboardLayout;

export default VideoEdits;
