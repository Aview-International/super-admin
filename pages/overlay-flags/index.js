import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getFlaggedSubtitledAndCaptionedJobs } from '../api/firebase';
import ErrorHandler from '../../utils/errorHandler';
import { getDownloadLink } from  '../../services/apis'
import {SupportedLanguages} from '../../constants/constants';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);

  const getPendingJobs = async () => {
    const res = await getFlaggedSubtitledAndCaptionedJobs();

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

  const handleDownloadVideo = async (jobId, creatorId, translatedLanguage) => {

    const videoPath = `dubbing-tasks/${creatorId}/${jobId}/${translatedLanguage}.mp4`;

    const res = await getDownloadLink(videoPath);
    const downloadLink = res.data;

    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

  }

  const handleDownloadSrt = async (jobId, creatorId, translatedLanguage) => {
    const translatedLanguageCode = (SupportedLanguages.find(language => language.languageName === translatedLanguage).translateCode)
    const videoPath = `dubbing-tasks/${creatorId}/${jobId}/${translatedLanguageCode}.srt`;

    const res = await getDownloadLink(videoPath);
    const downloadLink = res.data;
    
    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

  }

  const handleUpload = async (jobId, creatorId, translatedLanguage) => {

  }

  return (
    <>
    <PageTitle title="Captions & Subtitles" />
    <div className="w-full flex flex-col justify-center">
        <div className="text-white text-4xl">Jobs</div>
        <div className="bg-white-transparent rounded-2xl p-4">
            {jobs.length > 0 ? (
                <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                    <div className="text-white font-bold text-left">Job ID</div>
                    <div className="text-white font-bold text-left">Title</div>
                    <div className="text-white font-bold text-left">Translated Language</div>
                </div>

                <div className="w-full bg-white h-[1px] mt-s2 mb-s2"></div>
                {jobs.map((job) => (
                    <div key={job.jobId} className="">
                        <div className="hover:bg-white-transparent py-s2"> {/* Replace p-s2 with actual padding if needed */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                <div className="text-white text-left">{job.jobId}</div>
                                <div className="text-white text-left">{job.videoData.caption}</div>
                                <div className="text-white text-left">{job.translatedLanguage}</div>
                                <div className="text-white underline cursor-pointer" onClick={()=>{handleDownloadVideo(job.jobId, job.creatorId,job.translatedLanguage)}}>Video Download</div>
                                <div className="text-white underline cursor-pointer" onClick={()=>{handleDownloadSrt(job.jobId, job.creatorId, job.translatedLanguage)}}>Srt Download</div>
                                <div className="text-white underline cursor-pointer">Video Upload</div>
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
