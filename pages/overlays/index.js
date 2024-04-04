import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import ErrorHandler from '../../utils/errorHandler';
import {
  getSubtitledAndCaptionedJobs,
  getTranslatorId,
  acceptOverlayJob,
} from '../../services/firebase';

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
    try {
      const userId = localStorage.getItem('uid');
      const translatorId = await getTranslatorId(userId);

      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }
      await acceptOverlayJob(translatorId, jobId);

      window.open(`/overlays/edit?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
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
      <div className="flex w-full flex-col justify-center">
        <div className="text-4xl text-white">Jobs</div>
        <div className="rounded-2xl bg-white-transparent p-4">
          {jobs.length > 0 ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <div className="text-left font-bold text-white">Job ID</div>
                <div className="text-left font-bold text-white">Title</div>
                <div className="text-left font-bold text-white">
                  Translated Language
                </div>
              </div>

              <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
              {jobs.map((job) => (
                <div key={job.jobId} className="">
                  <div className="py-s2 hover:bg-white-transparent">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <div className="text-left text-white">{job.jobId}</div>
                      <div className="text-left text-white">
                        {job.videoData.caption}
                      </div>
                      <div className="text-left text-white">
                        {job.translatedLanguage}
                      </div>
                      <div
                        className="cursor-pointer text-white underline"
                        onClick={() => {
                          handleAccept(job.jobId);
                        }}
                      >
                        Accept job
                      </div>
                    </div>
                    <div className="h-[1px] w-full bg-white bg-opacity-25"></div>
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
