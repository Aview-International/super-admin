import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize the applications
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
// const admin_database = getDatabase(admin_app);
const database = getDatabase(app);

// Initialize the auth service
const auth = getAuth();

// get user from google account
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  return response;
};

export const getAllPendingTranscriptions = async (callback) => {
  const transcriptionRef = ref(database, `admin-jobs/pending/transcription`);
  onValue(transcriptionRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const getAllPendingTranslations = async (callback) => {
  const translationRef = ref(database, `admin-jobs/pending/translation`);
  onValue(translationRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const getAllPendingVideoEdits = async (callback) => {
  const dubbingRef = ref(database, `admin-jobs/pending/dubbing`);
  onValue(dubbingRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const getAllPendingDistribution = async () => {
  const res = await get(ref(database, `admin-jobs/pending/video-edit`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

export const getSingleVideoData = async (id) => {
  const res = await get(
    ref(database, `admin-jobs/pending/video-edit/${id}`)
  ).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};

// get all user data from the database
export const getUserProfile = async (_id) => {
  const res = await get(ref(database, `users/${_id}`)).then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    else return null;
  });
  return res;
};
