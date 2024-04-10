import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobsV2';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import PageTitle from '../../components/SEO/PageTitle';
import { getTranslatorFromUserId } from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("pending");
  const [translator, setTranslator] = useState(null);
  const [settings, setSettings] = useState(false);

  const handleTranslator = async (userId) => {
    const translator = await getTranslatorFromUserId(userId);
    console.log(translator.data);
    setTranslator(translator.data);
  };

  useEffect(() => {
    const token = Cookies.get("session");
    console.log(token);
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);

  },[]);

  return (
    <>
      <DashboardLayoutNoSidebar setSettings={setSettings}>
        <PageTitle title="Dashboard" />
        <ReviewerSettingsPopup show={settings} onClose={()=>{setSettings(false)}} translator={translator}/>
        <div className="flex flex-col justify-center w-full h-full p-s8 ">
            <div className="w-full h-[300px] mb-s2 flex">
              <div className="w-1/2 h-full pr-s1">
                <div className="w-full h-full flex">
                  <div className="w-1/3 h-full flex flex-col p-s2 bg-white-transparent rounded-2xl mr-s1">
                    <div className="text-white h-1/2 flex flex-col">
                      <div className="text-lg">
                        Lifetime earnings
                      </div>

                      <div className="text-8xl flex items-center h-full">
                        <div>
                          $24.54
                        </div>
                      </div>

                    </div>

                    <div className="text-white h-1/2 flex flex-col">
                      <div className="text-lg">
                        Weekly earnings
                      </div>

                      <div className="text-8xl flex items-center h-full">
                        <div>
                          $5.33
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="w-2/3 h-full flex flex-col p-s2 bg-white-transparent rounded-2xl ml-s1">
                    <div className="text-white text-lg">
                      Lifetime jobs
                    </div>
                  </div>

                </div>

              </div>

              <div className="w-1/2 h-full pl-s1">
                <div className="w-full h-full rounded-2xl bg-white-transparent p-s2">
                  <div className="text-white text-2xl">
                      Leaderboards
                    </div>
                </div>
              </div>

            </div>
            <div className="w-full bg-white-transparent rounded-2xl p-s2 flex items-center mb-s2">
                <div className="flex flex-row ">
                    <div className={`min-w-fit rounded-full text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "pending" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("pending")}>
                        Pending videos
                    </div>

                    <div className={`min-w-fit rounded-full text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "moderation" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("moderation")}>
                        Moderation
                    </div>

                    <div className={`min-w-fit rounded-full text-white py-s1 px-s2 text-xl mr-s2 cursor-pointer ${selectedOption == "overlays" ? "bg-white text-black":"bg-white-transparent text-white"}`} onClick={() => setSelectedOption("overlays")}>
                        Overlays
                    </div>
                </div>
            </div>

            <div>
                {selectedOption == "pending" && <PendingJobs />}
                {selectedOption == "moderation" && <ModerationJobs />}
                {selectedOption == "overlays" && <OverlayJobs />}
            </div>

            <div>

            </div>
        </div>
        </DashboardLayoutNoSidebar>
    </>
  );
};


export default Dashboard;
