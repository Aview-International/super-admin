import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getTranslatorById } from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';
import { getTranslatorId, getModerationJobs } from '../../services/firebase';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);
  const [translatorId, setTranslatorId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLanguages, setUserLanguages] = useState(null);

  const handleTranslator = async (userId) => {
    const translatorId = await getTranslatorId(userId);
    setTranslatorId(translatorId);
  };

  const getUserLanguages = async (translatorId) => {
    const translator = await getTranslatorById(translatorId);
    console.log(translator.data.nativeLanguage);
    setUserLanguages(translator.data.nativeLanguage);
  };

  const getPendingJobs = async (userLanguages) => {
    const res = await getModerationJobs(userLanguages, translatorId);

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
      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }

      window.open(`/translation/QA?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('uid');
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (userId) {
      handleTranslator(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (translatorId) {
      getUserLanguages(translatorId);
    }
  }, [translatorId]);

  useEffect(() => {
    if (userLanguages) {
      getPendingJobs(userLanguages);
    }
  }, [userLanguages]);

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
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <div className="text-left font-bold text-white">Job ID</div>
                <div className="text-left font-bold text-white">Title</div>
                <div className="text-left font-bold text-white">
                  Original Language
                </div>
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
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <div className="text-left text-white">{job.jobId}</div>
                      <div className="text-left text-white">
                        {job.videoData.caption}
                      </div>
                      <div className="text-left text-white">
                        {job.originalLanguage}
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
                        Go to job
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
