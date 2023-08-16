import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';

export const downloadS3Object = async (date, filePath, creatorId, object) =>
  await axios.post(baseUrl + 'admin/download-object', {
    date,
    filePath,
    creatorId,
    object,
  });

export const approveSrt = async (
  jobId,
  date,
  objectKey,
  creatorId,
  languages
) => {
  return axios.post(baseUrl + 'admin/approve-srt', {
    jobId,
    date,
    creatorId,
    objectKey,
    languages,
  });
};

export const approveTranslation = async (
  jobId,
  objectKey,
  date,
  translatedLanguageKey,
  creatorId
) => {
  return axios.post(baseUrl + 'admin/approve-translation', {
    jobId,
    objectKey,
    date,
    translatedLanguageKey,
    creatorId,
  });
};

export const downloadYoutubeVideo = async (id) => {
  const filename = id + '.mp4';
  const response = await axios.post(
    baseUrl + 'admin/download-youtube-video',
    { id },
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data]);

  // create anchor element
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  downloadLink.click();
  // cleanup
  URL.revokeObjectURL(downloadLink.href);
};

export const uploadFinalVideo = async (
  file,
  jobId,
  objectKey,
  date,
  creatorId,
  dubbedAudioKey
) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('creatorId', creatorId);
  formData.append('jobId', jobId);
  formData.append('date', date);
  formData.append('objectKey', objectKey);
  formData.append('dubbedAudioKey', dubbedAudioKey);
  await axios.post(baseUrl + 'admin/upload-final-video', formData, {
    'Content-Type': 'multipart/form-data',
  });
};

export const getYoutubeVideoData = async (videoId) => {
  const res = await axios.post(baseUrl + 'admin/get-youtube-data', {
    videoId,
  });
  return res.data;
};

export const getYoutubePlaylistData = async (videoId) => {
  const response = await axios.post(baseUrl + 'admin/get-youtube-playlist', {
    videoId,
  });

  const playlists = response.data.items.map((playlist) => ({
    name: playlist.snippet.title,
    id: playlist.id,
  }));

  return playlists;
};

export const getSupportedLanguages = async () => {
  const response = await axios.get(baseUrl + 'admin/supported-languages');
  return response.data;
};

export const getRegionCategory = async (language) => {
  const response = await axios.post(baseUrl + 'admin/youtube-categories', {
    language,
  });

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
  const response = await axios.post(baseUrl + 'admin/translate-text', {
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
  const response = await axios.post(baseUrl + 'admin/post-to-youtube', {
    filePath,
    creatorId,
    date,
    youtubePayload,
  });

  console.log(response);
};

export const uploadManualVideoTranscription = async (video, setProgress) => {
  let formData = new FormData();
  formData.append('video', video);
  const response = await axios({
    method: 'POST',
    url: baseUrl + 'transcription/manual-transcription',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: (progressEvent) =>
      setProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return response.data;
};

export const uploadManualSrtTranslation = async (
  srt,
  langugageCode,
  languageName
) => {
  let formData = new FormData();
  formData.append('srt', srt);
  formData.append('langugageCode', langugageCode);
  formData.append('languageName', languageName);
  const response = await axios({
    method: 'POST',
    url: baseUrl + 'admin/manual-translation',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
  return response.data;
};
