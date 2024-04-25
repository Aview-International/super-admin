import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getReviewersWithValidationImages, approveReferralValidationImage } from '../../services/api';
import Popup from '../../components/UI/PopupNormal';
import successHandler from '../../utils/successHandler';
import Button from '../../components/UI/Button';

const Subtitling = () => {
  const [reviewers, setReviewers] = useState([]);
  const [reviewerName, setReviewerName] = useState(null);
  const [reviewerImage, setReviewerImage] = useState(null);
  const [reviewerId, setReviewerId] = useState(null);
  const [popup, setPopup] = useState(false);

  const getPendingReviewers = async () => {
    const res = await getReviewersWithValidationImages();
    setReviewers(res.data);
    console.log(res.data);
  };

  const handleSetReviewerPopup = (reviewerName, reviewerImage, reviewerId) => {
    setReviewerName(reviewerName);
    setReviewerImage(reviewerImage);
    setReviewerId(reviewerId);
    setPopup(true);
  }

  const handleVerify = async () => {
    await approveReferralValidationImage(reviewerId).then(() => {
        successHandler("Verified successfully!");
        setReviewerName(null);
        setReviewerImage(null);
        setReviewerId(null);
        setPopup(false);
    })
    console.log('hello');
  }

  useEffect(() => {
    getPendingReviewers();
  }, []);





  return (
    <>
      <PageTitle title="Captions & Subtitles" />
      <Popup
        show={popup}
        onClose={() => {
            setReviewerName(null);
            setReviewerImage(null);
            setReviewerId(null);
            setPopup(false);
        }}
        >
        <div className="h-full w-full">
            <div className="w-[600px] rounded-2xl bg-black">
            <div className="w-[600px] rounded-2xl  bg-white-transparent py-s2 px-s4">
                <div className="flex flex-col items-center justify-center">
                <h2 className="mb-s2 w-full text-left text-2xl text-white">
                    {reviewerName ? reviewerName :""}
                </h2>
                <div className="w-full">
                <img src={reviewerImage} 
                    style={{ width: '100%', height: '100%' }}
                    alt="profile picture"
                    height={86}
                    width={86}/>
                </div>
                
                <div className="mt-s2 w-full relative">
                    <div className="float-right h-[47px] w-fit" onClick={handleVerify}>
                    <Button theme="success">
                        Verify
                    </Button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </Popup>
      <div className="flex w-full flex-col justify-center">
        <div className="text-4xl text-white">Reviewer Image Validation</div>
        <div className="rounded-2xl bg-white-transparent p-4">
          {reviewers.length > 0 ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <div className="text-left font-bold text-white">ReviewerId</div>
                <div className="text-left font-bold text-white">Name</div>
                <div className="text-left font-bold text-white">
                  Preview
                </div>
              </div>

              <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
              {reviewers.map((reviewer) => (
                <div key={reviewer._id} className="">
                  <div className="py-s2 hover:bg-white-transparent">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <div className="text-left text-white">{reviewer._id}</div>
                      <div className="text-left text-white">
                        {reviewer.name}
                      </div>
                      <div className="text-left text-white underline cursor-pointer" onClick={()=>{handleSetReviewerPopup(reviewer.name, reviewer.referralData.referralValidationImage, reviewer._id)}}>
                        Preview
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
