// dashboard sidebar icons
import home from '../public/img/icons/home.svg';
import transcription from '../public/img/icons/transcription.svg';
import translation from '../public/img/icons/translation.svg';
import dubbing from '../public/img/icons/dubbing.svg';
import videoedit from '../public/img/icons/video-edit.svg';

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

export const ONBOARDING_STAGE_4 = [
  {
    title: 'Translations',
    content: 'Translations of your content in any language of your choice.',
  },
  {
    title: 'Shorts',
    content: 'Your content edited into 15-30 second clips.',
  },
  {
    title: 'Dubbing',
    content: 'Dubbing and subtitles for your content. ',
  },
  {
    title: 'Distribution',
    content: 'We will manage and distribute your translated content for you.',
  },
];

export const AVERAGE_MONTHLY_VIEWS = [
  '0 - 1,000',
  '1,000 - 5,000',
  '5,000 - 10,000',
  '10,000 - 25,000',
  '25,000 - 100,000',
  '100,000 - 250,000',
  '250,000 - 500,000',
  '500,000 - 1,000,00',
  '1,000,000+',
];

export const AVERAGE_VIDEO_DURATION = [
  '1 - 5 minutes',
  '5 - 15 minutes',
  '15 - 30 minutes',
  '30 - 60 minutes',
  '60+ minutes',
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
    text: 'Dubbing',
    image: dubbing,
    route: '/dubbing',
  },
  {
    text: 'Video Edits',
    image: videoedit,
    route: '/video-edits',
  },
  {
    text: 'Home',
    image: home,
    route: '/dashboard',
  },
];

export const DAHSHBOARD_SERVICES = [
  'Subtitle',
  'Dubs',
  'Shorts',
  'Distribution',
];

export const DAHSHBOARD_TRANSLATED_LANGUAGES = [
  'English',
  'Spanish',
  'Portuguese',
  'French',
  'Hindi',
  'German',
  'Mandarin',
  'Arabic',
  'Others',
];
