import { useState } from 'react';
import { uploadReviewerProfilePicture } from '../../services/apis';
import { toast } from 'react-toastify';
import Image from 'next/image';
import defaultProfilePicture from '/public/img/graphics/default.png';
import Popup from '../UI/PopupNormal';

const ReviewerSettingsPopup = ({ show, onClose, translator }) => {
  const [file, setFile] = useState(null);

  const handleImageUpload = (e) => {
    const img = e.target.files[0];
    if (img.size > 2097152) {
      toast.error('Maximum file size of 2mb allowed');
      return;
    }
    setFile(img);
  };

  return (
    <Popup show={show} onClose={onClose}>
      <div className="rounded-2xl bg-indigo-1 px-s4 pt-s4 pb-s14">
        <div className="relative mx-auto h-[86px] w-[86px] mb-s3">
          <Image
            src={
              translator?.picture ? translator?.picture : defaultProfilePicture
            }
            alt="profile picture"
            height={86}
            width={86}
            className="rounded-full"
          />
          <label
            htmlFor="profilePicture"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-0 opacity-0 transition duration-300 ease-in-out hover:bg-opacity-50 hover:opacity-100"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profilePicture"
            />
            <span className="font-semibold">Change</span>
          </label>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Name</h3>
          <p className="capitalize">{translator?.name}</p>
        </div>

        <div className="my-s4">
          <h3 className="text-2xl font-bold">Email</h3>
          <p>{translator?.email}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">Native Languages</h3>
          <p>{translator?.nativeLanguage}</p>
        </div>

        <div className="my-s4">
          <h3 className="text-2xl font-bold">Country</h3>
          <p>{translator?.country}</p>
        </div>

        <div className="text-2xl font-bold">Payment method</div>
        <p>
          {translator.paymentMethod}: {translator.paymentDetails}
        </p>
      </div>
    </Popup>
  );
};

export default ReviewerSettingsPopup;
