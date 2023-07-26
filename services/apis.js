import axios from 'axios';
import { baseUrl } from '../components/baseUrl';

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
  date,
  objectKey,
  creatorId,
  languages
) => {
  return axios.post(baseUrl + 'admin/approve-translation', {
    jobId,
    date,
    creatorId,
    objectKey,
    languages,
  });
};
