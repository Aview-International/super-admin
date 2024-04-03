import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getTranslatorById } from '../../services/apis';
import { getModerationJobs, getTranslatorId, acceptOverlayJob } from '../api/firebase';
import ErrorHandler from '../../utils/errorHandler';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);
  const [translatorId, setTranslatorId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLanguages, setUserLanguages] = useState(null);

  const handleTranslator = async (userId) => {
    const translatorId = await getTranslatorId(userId);
    setTranslatorId(translatorId);
  }


  const getUserLanguages = async (translatorId) => {
    const translator = await getTranslatorById(translatorId);
    console.log(translator.data.nativeLanguage);
    setUserLanguages(translator.data.nativeLanguage);
  }

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
    try{

      if (translatorId==null){
        throw new Error("Invalid translatorId.");
      }

      window.open(`/translation/QA?translatorId=${translatorId}&jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  }
  
  useEffect(() => {
    const userId = localStorage.getItem('uid');
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (userId){
        handleTranslator(userId);
    }
  }, [userId]);
  
  useEffect(() => {
    if (translatorId){
        getUserLanguages(translatorId);
    }
  }, [translatorId]);

  useEffect(() => {
    if (userLanguages){
        getPendingJobs(userLanguages);
    }
  }, [userLanguages]);

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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                    <div className="text-white font-bold text-left">Job ID</div>
                    <div className="text-white font-bold text-left">Title</div>
                    <div className="text-white font-bold text-left">Original Language</div>
                    <div className="text-white font-bold text-left">Translated Language</div>
                </div>

                <div className="w-full bg-white h-[1px] mt-s2 mb-s2"></div>
                {jobs.map((job) => (
                    <div key={job.jobId} className="">
                        <div className="hover:bg-white-transparent py-s2"> {/* Replace p-s2 with actual padding if needed */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                <div className="text-white text-left">{job.jobId}</div>
                                <div className="text-white text-left">{job.videoData.caption}</div>
                                <div className="text-white text-left">{job.originalLanguage}</div>
                                <div className="text-white text-left">{job.translatedLanguage}</div>
                                <div className="text-white underline cursor-pointer" onClick={()=>{handleAccept(job.jobId)}}>Go to job</div>
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
