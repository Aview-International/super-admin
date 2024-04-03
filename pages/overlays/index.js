import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getSubtitledAndCaptionedJobs, getTranslatorId, acceptOverlayJob } from '../api/firebase';
import ErrorHandler from '../../utils/errorHandler';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);

  const getPendingJobs = async () => {
    const userId = localStorage.getItem('uid');
    const translatorId = await getTranslatorId(userId);
    console.log(translatorId);
    const res = await getSubtitledAndCaptionedJobs(translatorId);

    const pending = res
      ? Object.values(res).map((item, i) => ({
          ...item,
          jobId: Object.keys(res)[i],
        }))
      : [];
    setJobs(pending);
  };

  const handleAccept = async (jobId) => {
    try{
      const userId = localStorage.getItem('uid');
      const translatorId = await getTranslatorId(userId);

      if (translatorId==null){
        throw new Error("Invalid translatorId.");
      }
      await acceptOverlayJob(translatorId, jobId);

      window.open(`/overlays/edit?translatorId=${translatorId}&jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  }

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
                    <div className="text-white font-bold text-left">Translated Language</div>
                </div>

                <div className="w-full bg-white h-[1px] mt-s2 mb-s2"></div>
                {jobs.map((job) => (
                    <div key={job.jobId} className="">
                        <div className="hover:bg-white-transparent py-s2"> {/* Replace p-s2 with actual padding if needed */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                <div className="text-white text-left">{job.jobId}</div>
                                <div className="text-white text-left">{job.videoData.caption}</div>
                                <div className="text-white text-left">{job.translatedLanguage}</div>
                                <div className="text-white underline cursor-pointer" onClick={()=>{handleAccept(job.jobId)}}>Accept job</div>
                            </div>
                            <div className="w-full bg-white h-[1px] bg-opacity-25"></div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-white">No jobs available.</p>
            )}
        </div>
    </div>
    </>
  );
};

Subtitling.getLayout = DashboardLayout;

export default Subtitling;
