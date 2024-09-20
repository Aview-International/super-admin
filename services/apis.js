import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import { auth } from './firebase';

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

const isTokenExpired = (token) => {
  try {
    if (!token) return false;
    else {
      const data = decodeJwt(token);
      if (!data) return false;
      const newDate = new Date(data.exp) * 1000;
      if (newDate < new Date().getTime()) return true;
      else {
        return data;
      }
    }
  } catch (error) {
    return false;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = Cookies.get('session');
    if (isTokenExpired(token) === true || !isTokenExpired(token)) {
      const newToken = await auth.currentUser?.getIdToken(true); // force token refresh
      Cookies.set('session', newToken);
      token = newToken;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signInWithGoogleAcc = async (token) =>
  (await axiosInstance.post(baseUrl + 'auth/login', { token })).data;

export const downloadS3Object = async (s3Path) => {
  await axiosInstance.post(baseUrl + 'admin/download-object', {
    s3Path,
  });
};

export const getRawSRT = async (s3Path) => {
  const response = await axiosInstance.post(baseUrl + 'admin/get-raw-srt', {
    s3Path,
  });

  return response.data;
};

export const approveSrt = async (
  jobId,
  date,
  objectKey,
  creatorId,
  language
) => {
  return axiosInstance.post(baseUrl + 'admin/approve-srt', {
    jobId,
    date,
    creatorId,
    objectKey,
    language,
  });
};

export const approveTranslation = async (
  jobId,
  objectKey,
  date,
  translatedLanguageKey,
  creatorId
) => {
  return axiosInstance.post(baseUrl + 'dubbing/dub-srt', {
    jobId,
    objectKey,
    date,
    translatedLanguageKey,
    creatorId,
  });
};

export const getYoutubeVideoData = async (videoId) => {
  const res = await axiosInstance.post(baseUrl + 'admin/get-youtube-data', {
    videoId,
  });
  return res.data;
};

export const getYoutubePlaylistData = async (videoId) => {
  const response = await axiosInstance.post(
    baseUrl + 'admin/get-youtube-playlist',
    {
      videoId,
    }
  );

  const playlists = response.data.items.map((playlist) => ({
    name: playlist.snippet.title,
    id: playlist.id,
  }));

  return playlists;
};

export const getSupportedLanguages = async () =>
  (await axiosInstance.get(baseUrl + 'admin/supported-languages')).data;

export const getCountriesAndCodes = async () =>
  (await axiosInstance.get(baseUrl + 'admin/countries-and-codes')).data;

export const getRegionCategory = async (language) => {
  const response = await axiosInstance.post(
    baseUrl + 'admin/youtube-categories',
    {
      language,
    }
  );

  const categories = response.data
    .map((category) => {
      if (category.snippet.assignable)
        return {
          name: category.snippet.title,
          id: category.id,
        };
      else return;
    })
    .filter((item) => item !== undefined);

  return categories;
};

export const translateText = async (text, target_lang) => {
  const response = await axiosInstance.post(baseUrl + 'admin/translate-text', {
    text,
    target_lang,
  });
  return response.data;
};

export const postToYouTube = async (
  filePath,
  creatorId,
  date,
  youtubePayload
) => {
  const response = await axiosInstance.post(baseUrl + 'admin/post-to-youtube', {
    filePath,
    creatorId,
    date,
    youtubePayload,
  });

  console.log(response);
};

export const transcribeSocialLink = async (body) =>
  await axiosInstance.post('transcription/social', body);

export const finishPendingJob = async (jobId) => {
  await axiosInstance.post('admin/finish-pending-job', {
    jobId,
  });
};

export const createTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails
) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator', {
    name,
    email,
    nativeLanguage,
    country,
    paymentMethod,
    paymentDetails,
  });
};

export const updateTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails,
  translatorId
) => {
  return axiosInstance.post(baseUrl + 'admin/update-translator', {
    translatorData: {
      name,
      email,
      nativeLanguage,
      country,
      paymentMethod,
      paymentDetails,
    },
    translatorId,
  });
};

export const sendSupportMessage = async (email, message) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator-inquiry', {
    email,
    message,
  });
};

export const finishModerationJob = async (jobId, updatedSrt) => {
  return axiosInstance.post(baseUrl + 'admin/finish-moderation-job', {
    jobId,
    updatedSrt,
  });
};

export const getS3DownloadLink = async ({ userId, timestamp, lang }) =>
  (await axiosInstance.get(`admin/download/${userId}/${timestamp}/${lang}`))
    .data;

export const getDownloadLink = async (s3Path) => {
  const response = axiosInstance.post(baseUrl + 'admin/download-object', {
    s3Path,
  });

  return response;
};

export const getAllJobs = async (translatorId) => {
  return axiosInstance.post('admin/get-all-jobs', { translatorId });
};

export const finishOverlayJob = async (jobId, operationsArray) => {
  return axiosInstance.post(baseUrl + 'admin/finish-overlay-job', {
    jobId,
    operationsArray,
  });
};

export const verifyTranslatorEmail = async () => {
  await axiosInstance.get('admin/verify-translator');
};

export const getTranslatorFromUserId = async () =>
  (await axiosInstance.get('admin/translator')).data;

export const getAllPendingJobs = async () => {
  return axiosInstance.get('admin/get-pending-jobs');
};

export const getAllModerationJobs = async () => {
  return axiosInstance.get('admin/get-moderation-jobs');
};

export const getAllOverlayJobs = async () => {
  return axiosInstance.get('admin/get-overlay-jobs');
};

export const acceptJob = async (jobId, jobType) => {
  return axiosInstance.post('admin/accept-job', {
    jobId,
    jobType,
  });
};

export const getJobAndVerify = async (jobId) => {
  return axiosInstance.post('admin/get-job-and-verify', {
    jobId,
  });
};

export const getTranslatorLeaderboards = async () => {
  return axiosInstance.post('admin/get-translator-leaderboards');
};

export const singleSignOnLogin = async (email, origin) =>
  await axiosInstance.post(baseUrl + 'email/login', { email, origin });

export const uploadReviewerProfilePicture = async (translatorId, picture) => {
  const formData = new FormData();
  formData.append('translatorId', translatorId);
  formData.append('picture', picture);

  return axiosInstance.post('admin/upload-reviewer-profile-picture', formData);
};

export const addTime = async (jobId, jobType) => {
  return axiosInstance.post('admin/add-time', { jobId, jobType });
};

export const flagJob = async (jobId, message, jobType) => {
  return axiosInstance.post('admin/flag-job', {
    jobId,
    message,
    jobType,
  });
};

export const clearOverdueJobFromTimer = async (jobId, jobType) => {
  return axiosInstance.post('admin/clear-overdue-job-from-timer', {
    jobId,
    jobType,
  });
};

export const getCreatorProfile = async (userId) => {
  return axiosInstance.post('admin/get-creator-profile', { userId });
};
