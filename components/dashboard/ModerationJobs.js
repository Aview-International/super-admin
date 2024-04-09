import { useEffect, useState } from 'react';
import { getTranslatorFromUserId } from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';
import { 
  getAllModerationJobs,
  acceptJob, } from '../../services/firebase';
import Cookies from 'js-cookie';
import { authStatus } from '../../utils/authStatus';

const ModerationJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userLanguages, setUserLanguages] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);

  const getUserLanguages = async (userId) => {
    const translator = await getTranslatorFromUserId(userId);
    console.log(translator.data._id);
    setUserLanguages(translator.data.nativeLanguage);
    setTranslatorId(translator.data._id);
  };
  
  const getModerationJobs = async (userLanguages) => {
    const res = await getAllModerationJobs(userLanguages, translatorId);

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
      
      await acceptJob(translatorId, jobId, "moderation");

      window.open(`/moderation?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  };


  useEffect(() => {
    const token = Cookies.get("session");
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    getUserLanguages(userId);

  },[]);

  useEffect(() => {
    if (userLanguages&&translatorId) {
      getModerationJobs(userLanguages);
    }
  }, [userLanguages,translatorId]);

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  return (
    <>
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
    </>
  );
};

export default ModerationJobs;
