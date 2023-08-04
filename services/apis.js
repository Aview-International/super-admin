import axios from 'axios';
import { baseUrl } from './baseUrl';

export const downloadSrtFile = async (date, filePath, creatorId) =>
  await axios.post(baseUrl + 'admin/download-srt', {
    date,
    filePath,
    creatorId,
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

export const downloadAudioFile = async (date, filePath, creatorId) =>
  await axios.post(baseUrl + 'admin/download-audio', {
    date,
    filePath,
    creatorId,
  });

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
