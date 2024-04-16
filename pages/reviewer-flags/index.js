import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getDownloadLink, getFlaggedJobs } from '../../services/api';
import { SupportedLanguages } from '../../constants/constants';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);

  const getPendingJobs = async () => {
    const res = await getFlaggedJobs();
    const resData = res.data;

    const pending = resData
      ? Object.values(resData).map((item, i) => ({
          ...item,
          jobId: Object.keys(resData)[i],
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
  };

  const handleDownloadSrt = async (jobId, creatorId, translatedLanguage) => {
    const translatedLanguageCode = SupportedLanguages.find(
      (language) => language.languageName === translatedLanguage
    ).translateCode;
    const videoPath = `dubbing-tasks/${creatorId}/${jobId}/${translatedLanguageCode}.srt`;

    const res = await getDownloadLink(videoPath);
    const downloadLink = res.data;

    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleUpload = async (jobId, creatorId, translatedLanguage) => {};

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
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
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
                    {' '}
                    {/* Replace p-s2 with actual padding if needed */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
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
                          handleDownloadVideo(
                            job.jobId,
                            job.creatorId,
                            job.translatedLanguage
                          );
                        }}
                      >
                        Video Download
                      </div>
                      <div
                        className="cursor-pointer text-white underline"
                        onClick={() => {
                          handleDownloadSrt(
                            job.jobId,
                            job.creatorId,
                            job.translatedLanguage
                          );
                        }}
                      >
                        Srt Download
                      </div>
                      <div className="cursor-pointer text-white underline">
                        Video Upload
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
