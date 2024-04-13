import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobs';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import AllJobs from '../../components/dashboard/AllJobs';
import PageTitle from '../../components/SEO/PageTitle';
import { 
  getTranslatorFromUserId, 
  getTranslatorLeaderboards,
  acceptJob } from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';
import PieChart from '../../components/UI/PieChart';
import Popup from '../../components/UI/PopupNormal';
import Button from '../../components/UI/Button';
import ErrorHandler from '../../utils/errorHandler';


const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [translator, setTranslator] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);
  const [settings, setSettings] = useState(false);
  const [leaderboards, setLeaderboards] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [popupPreview, setPopupPreview] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);
  const [previewJobVideoLink, setPreviewJobVideoLink] = useState(null);
  const [previewJobType, setPreviewJobType] = useState(null);

  const handleTranslator = async () => {
    const token = Cookies.get("session");
    const userId = authStatus(token).data.user_id;

    const translatorInfo = await getTranslatorFromUserId(userId);
    setTranslator(translatorInfo.data);
    setTranslatorId(translatorInfo.data._id);

    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: '# of Votes',
          data: [translatorInfo.data.pendingJobsCompleted, translatorInfo.data.moderationJobsCompleted, translatorInfo.data.overlayJobsCompleted],
          backgroundColor: [
            '#FF3939',
            '#FC00FF',
            '#00FFFF'
          ],
          borderColor: [
            '#FF3939',
            '#FC00FF',
            '#00FFFF'
          ],
          borderWidth: 1,
        },
      ],
    };

    setPieChartData(data);
  };

  const handleAccept = async() => {
    console.log(popupPreview)
    if (popupPreview) {
      console.log("runs")
;      if (previewJobType == "moderation"){
        await handleAcceptModerationjob(previewJob.jobId);
      }else if (previewJobType == "pending"){
        await handleAcceptPendingJob(previewJob.jobId);
      }else if (previewJobType == "overlay"){
        await handleAcceptOverlayJob(previewJob.jobId);
      }
    }
  }

  const handleAcceptPendingJob = async (jobId) => {
    try {
      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }
      await acceptJob(translatorId, jobId, "pending");

      window.open(`/pending?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  };

  const handleAcceptOverlayJob = async (jobId) => {
    try {
      if (translatorId == null) {
        throw new Error('Invalid translatorId.');
      }
      await acceptJob(translatorId, jobId, "overlay");

      window.open(`/overlays?jobId=${jobId}`, '_blank');
    }catch(error){
      ErrorHandler(error);
    }
  };

  const handleAcceptModerationjob = async (jobId) => {
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

  const handleLeaderboards = async () => {
    const leaderboard = await getTranslatorLeaderboards();
    const leaderboardData = leaderboard.data;
    console.log(leaderboardData);
    setLeaderboards(leaderboardData);
  }

  useEffect(() => {
    handleTranslator();
    handleLeaderboards();

  },[]);

  const formatMoney = (amount) => {
    let dollars = Math.floor(amount / 100);
    let cents = amount % 100;
    return dollars + '.' + (cents < 10 ? '0' : '') + cents;
  }

  return (
    <>
      <style>
        {`
            ::-webkit-scrollbar-track {
                background: #28243c !important;
                border-radius: 100vw;
            }
            `}
      </style>
      <div className="min-w-[1300px]">
      <DashboardLayoutNoSidebar setSettings={setSettings} profilePicture={translator ? translator.profilePicture : null} name={translator ? translator.name:""}>
        <PageTitle title="Dashboard" />
        <ReviewerSettingsPopup show={settings} onClose={()=>{setSettings(false);}} translator={translator}/>
        <Popup show={popupPreview} onClose={() => {setPopupPreview(false); setPreviewJob(null); setPreviewJobType(null); setPreviewJobVideoLink(null)}}>
            <div className="h-full w-full">
            <div className="w-[600px] rounded-2xl bg-black">
              <div className="w-[600px] rounded-2xl bg-white-transparent py-s2 px-s4">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="mb-s2 text-2xl text-white text-left w-full">Preview</h2>
                  <div
                  className="relative w-full overflow-hidden"
                  style={{ paddingTop: '56.25%' }}
                  >
                      {previewJobVideoLink &&
                      <video
                          style={{
                          objectFit: 'contain',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#000',
                          }}
                          controls
                      >
                          <source
                          src={previewJobVideoLink ? previewJobVideoLink : ''}
                          type="video/mp4"
                          />
                      </video>
                      }
                  </div>
                  <div className="w-full mt-s2">
                    <div className="float-right h-[47px] w-[170px]">
                      <Button
                        theme="success"
                        onClick={() => {handleAccept()}}
                      >
                        Accept job
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </Popup>
        <div className="flex flex-col justify-center w-full h-full p-s8 ">
            <div className="w-full h-[320px] mb-s2 flex">
              <div className="w-1/3 h-full pr-s1">
                <div className="w-full h-full rounded-2xl bg-white-transparent p-s2">
                    <div className="text-white text-2xl">
                      Earnings
                    </div>
                    <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                    <div className="text-lg text-white mb-s1">Lifetime</div>
                    <div className="text-lg text-white bg-white-transparent rounded-lg p-s1.5 text-5xl font-bold">${translator ? formatMoney(translator.totalPayment) : ""}</div>
                    <div className="text-lg text-white mt-s4 mb-s1">Weekly</div>
                    <div className="text-lg text-white bg-white-transparent rounded-lg p-s1.5 text-5xl font-bold">${translator ? formatMoney(translator.paymentOwed) : ""}</div>
                </div>

              </div>

              <div className="w-1/3 h-full pr-s1 pl-s1">
                <div className="w-full h-full rounded-2xl bg-white-transparent p-s2">
                    <div className="text-white text-2xl">
                      Job Statistics
                    </div>
                    <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                    <div className="w-full flex flex-row">
                      <div className="w-1/2 pr-s1">
                        <div className="w-full h-full max-h-[221px]">
                          <PieChart data={pieChartData ? pieChartData : null}/>
                        </div>
                      </div>
                      <div className="w-1/2 flex justify-center flex-col pl-s1">
                        <div className="text-white text-lg font-bold">{translator ? translator.totalJobsCompleted:""} {(translator && translator.totalJobsCompleted) == 1 ? "job completed":"jobs completed"}</div>
                        <div className="flex flex-row w-full items-center mt-s1">
                          <div className="rounded-full h-[14px] w-[14px] bg-blue mr-s1"></div>
                          <div className="text-lg text-white pt-[4px]">Pending</div>
                          <div className="rounded-lg pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center w-[50px]">{translator ? translator.pendingJobsCompleted : ""}</div>
                        </div>
                        <div className="flex flex-row w-full items-center">
                          <div className="rounded-full h-[14px] w-[14px] bg-purple mr-s1"></div>
                          <div className="text-lg text-white pt-[4px]">Moderation</div>
                          <div className="rounded-lg pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center w-[50px]">{translator ? translator.moderationJobsCompleted : ""}</div>
                        </div>
                        <div className="flex flex-row w-full items-center">
                          <div className="rounded-full h-[14px] w-[14px] bg-red mr-s1"></div>
                          <div className="text-lg text-white pt-[4px]">Moderation</div>
                          <div className="rounded-lg pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center w-[50px]">{translator ? translator.overlayJobsCompleted : ""}</div>
                        </div>
                      </div>
                   
                    </div>
                </div>

              </div>

              <div className="w-1/3 h-full pl-s1">
                <div className="w-full h-full rounded-2xl bg-white-transparent p-s2">
                    <div className="text-white text-2xl">
                      Leaderboards
                    </div>
                    <div className="mt-s2  h-[1px] w-full bg-white"></div>
                    <div className="overflow-y-scroll overflow-x-hidden h-[226px]">
                    {leaderboards.map((translator, i) => (
                      <>
                      <div key={i} className="w-full my-s2">
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-row items-center">
                            <div className="text-lg text-white font-bold w-[22px] mt-[3px] mr-s2">{i+1}</div>
                            <img src={translator.profilePicture ? translator.profilePicture + "?v=" + new Date().getTime() : "/img/graphics/default.png"} style={{width:"32px", height:"32px"}} className="rounded-full mr-s2"/>
                            <div className="text-base text-white font-bold mt-[3px]">{translator.name}</div>
                          </div>
                          <div className="text-base text-white font-bold mt-[3px] mr-s2">{translator.totalJobsCompleted} jobs</div>
                        </div>
                      </div>
                      </>
                    ))}
                    </div>
                </div>
              </div>

            </div>
            <div className="w-full p-s1 flex items-center mb-s2">
                <div className="flex flex-row ">
                    <div className={`min-w-fit rounded-xl text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "all" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("all")}>
                      All
                    </div>

                    <div className={`min-w-fit rounded-xl text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "pending" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("pending")}>
                      Pending
                    </div>

                    <div className={`min-w-fit rounded-xl text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "moderation" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("moderation")}>
                      Moderation
                    </div>

                    <div className={`min-w-fit rounded-xl text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "overlay" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("overlay")}>
                      Overlay
                    </div>
                </div>
            </div>

            <div>
                {selectedOption == "all" && <AllJobs setPopupPreview={setPopupPreview} setPreviewJob={setPreviewJob} setPreviewJobType={setPreviewJobType} setPreviewJobVideoLink={setPreviewJobVideoLink}/>}
                {selectedOption == "pending" && <PendingJobs setPopupPreview={setPopupPreview} setPreviewJob={setPreviewJob} setPreviewJobType={setPreviewJobType} setPreviewJobVideoLink={setPreviewJobVideoLink}/>}
                {selectedOption == "moderation" && <ModerationJobs setPopupPreview={setPopupPreview} setPreviewJob={setPreviewJob} setPreviewJobType={setPreviewJobType} setPreviewJobVideoLink={setPreviewJobVideoLink}/>}
                {selectedOption == "overlay" && <OverlayJobs setPopupPreview={setPopupPreview} setPreviewJob={setPreviewJob} setPreviewJobType={setPreviewJobType} setPreviewJobVideoLink={setPreviewJobVideoLink}/>}
            </div>

            <div>

            </div>
        </div>
        </DashboardLayoutNoSidebar>
        </div>
    </>
  );
};


export default Dashboard;
