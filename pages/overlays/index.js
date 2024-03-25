import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getSubtitledAndCaptionedJobs } from '../api/firebase';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);

  const getPendingJobs = async () => {
    const res = await getSubtitledAndCaptionedJobs();

    const pending = res
      ? Object.values(res).map((item, i) => ({
          ...item,
          jobId: Object.keys(res)[i],
        }))
      : [];
    setJobs(pending);
  };

  useEffect(() => {
    getPendingJobs();
  }, []);

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  return (
    <>
    <PageTitle title="Captions & Subtitles" />
    <div className="w-full flex flex-col justify-center">
        <div className="text-white text-4xl">Jobs</div>
        <div className="bg-white-transparent rounded-2xl p-4">
            {jobs.length > 0 ? (
                <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                    <div className="text-white font-bold text-left">Job ID</div>
                    <div className="text-white font-bold text-left">Title</div>
                    <div className="text-white font-bold text-left">Original Language</div>
                </div>

                <div className="w-full bg-white h-[1px] mt-s2 mb-s2"></div>
                {jobs.map((job) => (
                    <div key={job.jobId} className="">
                        <div className="hover:bg-white-transparent py-s2"> {/* Replace p-s2 with actual padding if needed */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                <div className="text-white text-left">{job.jobId}</div>
                                <div className="text-white text-left">{job.videoData.caption}</div>
                                <div className="text-white text-left">{job.originalLanguage}</div>
                                <div className="text-white underline cursor-pointer">Accept job</div>
                            </div>
                            <div className="w-full bg-white h-[1px] bg-opacity-25"></div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p>No jobs available.</p>
            )}
        </div>
    </div>
    </>
  );
};

Subtitling.getLayout = DashboardLayout;

export default Subtitling;
