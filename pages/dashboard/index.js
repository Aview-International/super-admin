import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobsV2';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import AllJobs from '../../components/dashboard/AllJobs';
import PageTitle from '../../components/SEO/PageTitle';
import {
  getTranslatorFromUserId,
  getTranslatorLeaderboards,
} from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [translator, setTranslator] = useState(null);
  const [settings, setSettings] = useState(false);
  const [leaderboards, setLeaderboards] = useState([]);

  const handleTranslator = async (userId) => {
    const translatorInfo = await getTranslatorFromUserId(userId);
    console.log(translatorInfo.data);
    setTranslator(translatorInfo.data);
  };

  const handleLeaderboards = async () => {
    const leaderboard = await getTranslatorLeaderboards();
    const leaderboardData = leaderboard.data;
    console.log(leaderboardData);
    setLeaderboards(leaderboardData);
  };

  useEffect(() => {
    const token = Cookies.get('session');
    console.log(token);
    const userId = authStatus(token).data.user_id;
    console.log(token);
    console.log(userId);

    handleTranslator(userId);
    handleLeaderboards();
  }, []);

  const formatMoney = (amount) => {
    let dollars = Math.floor(amount / 100);
    let cents = amount % 100;
    return dollars + '.' + (cents < 10 ? '0' : '') + cents;
  };

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
      <DashboardLayoutNoSidebar
        setSettings={setSettings}
        name={translator ? translator.name : ''}
      >
        <PageTitle title="Dashboard" />
        <ReviewerSettingsPopup
          show={settings}
          onClose={() => {
            setSettings(false);
          }}
          translator={translator}
        />
        <div className="flex h-full w-full flex-col justify-center p-s8 ">
          <div className="mb-s2 flex h-[320px] w-full">
            <div className="h-full w-1/3 pr-s1">
              <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                <div className="text-2xl text-white">Earnings</div>
                <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                <div className="mb-s1 text-lg text-white">Lifetime</div>
                <div className="rounded-lg bg-white-transparent p-s1.5 text-lg text-5xl font-bold text-white">
                  ${translator ? formatMoney(translator.totalPayment) : ''}
                </div>
                <div className="mt-s4 mb-s1 text-lg text-white">Weekly</div>
                <div className="rounded-lg bg-white-transparent p-s1.5 text-lg text-5xl font-bold text-white">
                  ${translator ? formatMoney(translator.paymentOwed) : ''}
                </div>
              </div>
            </div>

            <div className="h-full w-1/3 pr-s1 pl-s1">
              <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                <div className="text-2xl text-white">Job Statistics</div>
                <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
              </div>
            </div>

            <div className="h-full w-1/3 pl-s1">
              <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                <div className="text-2xl text-white">Leaderboards</div>
                <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                <div className="h-[226px] overflow-x-hidden overflow-y-scroll">
                  {leaderboards.map((translator, i) => (
                    <>
                      <div key={i} className="my-s2 w-full">
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center">
                            <div className="mt-[3px] mr-s2 w-[22px] text-lg font-bold text-white">
                              {i + 1}
                            </div>
                            <div className="mr-s2 h-[32px] w-[32px] rounded-full bg-white-transparent"></div>
                            <div className="mt-[3px] text-base font-bold text-white">
                              {translator.name}
                            </div>
                          </div>
                          <div className="mt-[3px] mr-s2 text-base font-bold text-white">
                            {translator.totalJobsCompleted} jobs
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-s2 flex w-full items-center p-s1">
            <div className="flex flex-row ">
              <div
                className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl text-white ${
                  selectedOption == 'all'
                    ? 'bg-white text-black'
                    : 'bg-white-transparent text-white'
                }`}
                onClick={() => setSelectedOption('all')}
              >
                All
              </div>

              <div
                className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl text-white ${
                  selectedOption == 'pending'
                    ? 'bg-white text-black'
                    : 'bg-white-transparent text-white'
                }`}
                onClick={() => setSelectedOption('pending')}
              >
                Pending
              </div>

              <div
                className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl text-white ${
                  selectedOption == 'moderation'
                    ? 'bg-white text-black'
                    : 'bg-white-transparent text-white'
                }`}
                onClick={() => setSelectedOption('moderation')}
              >
                Moderation
              </div>

              <div
                className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl text-white ${
                  selectedOption == 'overlay'
                    ? 'bg-white text-black'
                    : 'bg-white-transparent text-white'
                }`}
                onClick={() => setSelectedOption('overlay')}
              >
                Overlay
              </div>
            </div>
          </div>

          <div>
            {selectedOption == 'all' && <AllJobs />}
            {selectedOption == 'pending' && <PendingJobs />}
            {selectedOption == 'moderation' && <ModerationJobs />}
            {selectedOption == 'overlay' && <OverlayJobs />}
          </div>

          <div></div>
        </div>
      </DashboardLayoutNoSidebar>
    </>
  );
};

export default Dashboard;
