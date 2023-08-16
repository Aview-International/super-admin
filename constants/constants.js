import transcription from '../public/img/icons/transcript.svg';
import translation from '../public/img/icons/translation.svg';
import dubbing from '../public/img/icons/dubbing.svg';
import videoedit from '../public/img/icons/video-edit.svg';
import creator from '../public/img/icons/creator.svg';

export const LANGUAGES = [
  'English',
  'French',
  'German',
  'Spanish',
  'Swedish',
  'Portuguese',
  'Arabic',
  'Russian',
  'Chinese',
];

export const DASHBOARD_NAVLINKS = [
  {
    text: 'Transcription',
    image: transcription,
    route: '/transcription',
  },
  {
    text: 'Translation',
    image: translation,
    route: '/translation',
  },
  {
    text: 'Dubbing & Edits',
    image: videoedit,
    route: '/dubbing-edits',
  },
  {
    text: 'Distribution',
    image: creator,
    route: '/distribution',
  },
  {
    text: 'Manual',
    image: dubbing,
    route: '/manual',
  },
];
