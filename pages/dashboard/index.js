import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobs';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import PageTitle from '../../components/SEO/PageTitle';
import { getTranslatorFromUserId } from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';


const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("pending");
  const [translatorId, setTranslatorId] = useState(null);

  const handleTranslator = async (userId) => {
    const translator = await getTranslatorFromUserId(userId);
    console.log(translator.data._id);
    setTranslatorId(translator.data._id);
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
        <PageTitle title="Dashboard" />
        <div className="flex flex-col justify-center w-full h-full p-s8 ">
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
    </>
  );
};

Dashboard.getLayout = DashboardLayoutNoSidebar;

export default Dashboard;
