import { useContext, useEffect, useState } from 'react';
import FormInput from '../../components/FormComponents/FormInput';
import RadioInput from '../../components/FormComponents/RadioInput';
import Textarea from '../../components/FormComponents/Textarea';
import PageTitle from '../../components/SEO/PageTitle';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import {
  getYoutubePlaylistData,
  getYoutubeVideoData,
} from '../../services/apis';
import { useRouter } from 'next/router';
import { UserContext } from '../../store/user-profile';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Border from '../../components/UI/Border';
import axios from 'axios';
import { countries } from 'countries-list';

const DistributionVideo = () => {
  console.log(countries);
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);
  const { user } = useContext(UserContext);
  const [language, setLanguage] = useState('');
  const [payload, setPayload] = useState(undefined);

  const [youtubePayload, setYoutubePayload] = useState({
    snippet: {
      title: '',
      description: '',
      categoryId: '', // Replace with your desired category ID
    },
    status: {
      privacyStatus: 'public', // You can set the privacy status (public, private, unlisted)
    },
    localizations: {
      en: {
        title: 'English Title',
        description: 'English Description',
      },
      fr: {
        title: 'Titre français',
        description: 'Description en français',
      },
    },
  });

  const getPlaylists = async () => {
    try {
      const list = await getYoutubePlaylistData(user.youtubeChannelId);
      setPlaylists(list);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const getYoutubeData = async (id) => {
    const data = await getYoutubeVideoData(id);
    console.log(data);
    setPayload(data.items[0]);
    const details = data.items[0];
    setYoutubePayload({
      ...youtubePayload,
      snippet: {
        ...youtubePayload.snippet,
        title: details.snippet.title,
        description: details.snippet.description,
      },
    });
  };

  const getCat = async () => {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&regionCode=CA`
    );
    console.log(res.data.items);
  };

  useEffect(() => {
    // getCat();
    // const { id } = router.query;
    // getYoutubeData(id);
    // getPlaylists();
  }, [router.query]);

  const handleMadeForKidsChange = (data) => {
    setPayload({
      ...payload,
      snippet: {
        ...payload.snippet,
        madeForKids: data,
      },
    });
  };

  console.log(playlists);

  return (
    <>
      <PageTitle title="Distribution" />
      <div className="mt-s3 flex px-s3 text-white">
        <div className="w-1/2">
          <p>Download Video</p>
        </div>
        <div className="ml-s3 w-1/2">
          <FormInput label="Title" />
          <Textarea label="Description" />
          <div>
            <p>Thumbnail</p>
            {payload && (
              <Image
                src={payload.snippet.thumbnails.default.url}
                alt=""
                width={192}
                height={108}
              />
            )}
          </div>
          <p>Details</p>
          <p>Playlists</p>

          <p>Audience</p>
          <RadioInput
            name="madeForKids"
            label="Yes, it's made for kids"
            onChange={() => handleMadeForKidsChange(true)}
            value={true}
            chosenValue={payload?.madeForKids}
          />
          <RadioInput
            name="madeForKids"
            label="No, it's not made for kids"
            onChange={() => handleMadeForKidsChange(false)}
            value={false}
            chosenValue={payload?.madeForKids}
          />

          <div>
            <p>Tags</p>
            <Border borderRadius="md">
              <div className="rounded-md bg-black p-s2">
                {payload?.snippet.tags.map((el, i) => (
                  <div
                    key={i}
                    className="m-2 rounded-full bg-white-transparent p-2"
                  >
                    {el}
                    <span>x</span>
                  </div>
                ))}
              </div>
            </Border>
          </div>
        </div>
      </div>
    </>
  );
};

DistributionVideo.getLayout = DashboardLayout;

export default DistributionVideo;
