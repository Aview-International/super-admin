import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobsV2';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import AllJobs from '../../components/dashboard/AllJobs';
import PageTitle from '../../components/SEO/PageTitle';
import { 
  getTranslatorFromUserId, 
  getTranslatorLeaderboards } from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';
import PieChart from '../../components/UI/PieChart';


const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [translator, setTranslator] = useState(null);
  const [settings, setSettings] = useState(false);
  const [leaderboards, setLeaderboards] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);

  const handleTranslator = async () => {
    const token = Cookies.get("session");
    console.log(token);
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    const translatorInfo = await getTranslatorFromUserId(userId);
    console.log(translatorInfo.data);
    setTranslator(translatorInfo.data);

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
                          <div className="rounded-full pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center">{translator ? translator.pendingJobsCompleted : ""}</div>
                        </div>
                        <div className="flex flex-row w-full items-center">
                          <div className="rounded-full h-[14px] w-[14px] bg-purple mr-s1"></div>
                          <div className="text-lg text-white pt-[4px]">Moderation</div>
                          <div className="rounded-full pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center">{translator ? translator.moderationJobsCompleted : ""}</div>
                        </div>
                        <div className="flex flex-row w-full items-center">
                          <div className="rounded-full h-[14px] w-[14px] bg-red mr-s1"></div>
                          <div className="text-lg text-white pt-[4px]">Moderation</div>
                          <div className="rounded-full pt-[2px] px-[8px] bg-white-transparent ml-auto text-white text-base text-center">{translator ? translator.overlayJobsCompleted : ""}</div>
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
                    <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
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
              {selectedOption == "all" && <AllJobs />}
                {selectedOption == "pending" && <PendingJobs />}
                {selectedOption == "moderation" && <ModerationJobs />}
                {selectedOption == "overlay" && <OverlayJobs />}
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
