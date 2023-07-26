import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getDatabase, ref, child, get, update } from 'firebase/database';

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
// const admin_app = initializeApp(admin_firebaseConfig);
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

export const getAllPendingJobs = async () => {
  const res = await get(ref(database, `admin-jobs/pending/transcription`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else return null;
    }
  );
  return res;
};

export const getAllPendingTranslations = async () => {
  const res = await get(ref(database, `admin-jobs/pending/translation`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else return null;
    }
  );
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

export const getAllCompletedJobs = async () => {
  const res = await get(ref(database, `admin-jobs/completed`)).then(
    (snapshot) => {
      if (snapshot.exists()) return snapshot.val();
      else return null;
    }
  );
  return res;
};

export const markVideoAsCompleted = async (creatorId, jobId, jobDetails) => {
  await get(child(ref(database), `users/${creatorId}`)).then(
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newPostData = {
          ...data,
          completedVideos: 1,
          pendingVideos: +data.pendingVideos - 1,
        };
        const existingPostData = {
          ...data,
          pendingVideos: +data.pendingVideos - 1,
          completedVideos: +data.completedVideos + 1,
        };
        const updates = {
          [`users/${creatorId}`]: data.completedVideos
            ? existingPostData
            : newPostData,
          [`user-jobs/completed/${creatorId}/${jobId}`]: jobDetails,
          [`admin-jobs/pending/${jobId}`]: null,
          [`user-jobs/pending/${creatorId}/${jobId}`]: null,
          [`admin-jobs/completed/${jobId}`]: jobDetails,
        };
        await update(ref(database), updates);
      }
    }
  );
};
