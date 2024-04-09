import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
  getDatabase,
  ref,
  get,
  onValue,
  update,
  serverTimestamp,
} from 'firebase/database';

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
export const firebaseAuth = getAuth(app);

// get user from google account
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(firebaseAuth, provider);
  return response;
};

export const getAllPendingTranscriptions = async (callback) => {
  const transcriptionRef = ref(database, `admin-jobs/pending/transcription`);
  onValue(transcriptionRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const getAllJobsUnderReview = async (callback) => {
  const database = getDatabase();
  const jobsRef = ref(database, 'user-jobs/pending');

  get(jobsRef)
    .then((usersSnapshot) => {
      let allUnderReviewJobs = {};

      usersSnapshot.forEach((userSnapshot) => {
        userSnapshot.forEach((jobSnapshot) => {
          const job = jobSnapshot.val();
          const jobId = jobSnapshot.key;
          if (job.status === 'under review') {
            allUnderReviewJobs[jobId] = job;
          }
        });
      });

      callback(allUnderReviewJobs);
    })
    .catch((error) => {
      console.error('Firebase read failed: ', error);
    });
};

export const getAllPendingTranscriptionsApproval = async (callback) => {
  const transcriptionRef = ref(
    database,
    `admin-jobs/pending/transcription-approve`
  );
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

export const getFirebaseJob = async (jobId, callback) => {
  console.log(`Job ID: ${jobId}`);
  const translationRef = ref(database, `admin-jobs/pending/${jobId}`);
  try {
    onValue(translationRef, (snapshot) => {
      const jobData = snapshot.val();
      if (jobData) {
        callback(snapshot.val());
      }
    });
  } catch (error) {
    console.log('error' + error);
  }
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

export const getSubtitledAndCaptionedJobs = async (translatorId) => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const allJobs = snapshot.val();
        const filteredJobs = Object.keys(allJobs).reduce((acc, key) => {
          const job = allJobs[key];
          if (
            job['status'] == 'subtitling' &&
            job['overlaysStatus'] != 'flagged' &&
            (job['overlaysStatus'] == null ||
              job['translatorId'] == translatorId ||
              job['translatorId'] == null)
          ) {
            acc[key] = job;
          }
          return acc;
        }, {});
        return filteredJobs;
      } else return null;
    }
  );
  return res;
};

export const getAllModerationJobs = async (userLanguages, translatorId) => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const allJobs = snapshot.val();
        const filteredJobs = Object.keys(allJobs).reduce((acc, key) => {
          const job = allJobs[key];
          if (
            userLanguages.includes(job['translatedLanguage']) &&
            userLanguages.includes(job['originalLanguage']) &&
            job['status'] == 'moderation' &&
            (job['translatorId'] == translatorId || job['translatorId'] == null)
          ) {
            acc[key] = job;
          }
          return acc;
        }, {});
        return filteredJobs;
      } else return null;
    }
  );
  return res;
};

export const getAllPendingJobs = async (userLanguages, translatorId) => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const allJobs = snapshot.val();
        const filteredJobs = Object.keys(allJobs).reduce((acc, key) => {
          const job = allJobs[key];
          if (
            userLanguages.includes(job['translatedLanguage']) &&
            userLanguages.includes(job['originalLanguage']) &&
            job['status'] == 'under review' &&
            (job['translatorId'] == translatorId || job['translatorId'] == null)
          ) {
            acc[key] = job;
          }
          return acc;
        }, {});
        return filteredJobs;
      } else return null;
    }
  );
  return res;
};

export const getFlaggedSubtitledAndCaptionedJobs = async () => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const allJobs = snapshot.val();
        const filteredJobs = Object.keys(allJobs).reduce((acc, key) => {
          const job = allJobs[key];
          if (
            job['status'] == 'subtitling' &&
            job['overlaysStatus'] == 'flagged'
          ) {
            acc[key] = job;
          }
          return acc;
        }, {});
        return filteredJobs;
      } else return null;
    }
  );
  return res;
};

export const getTranslatorId = async (userId) => {
  const userRef = ref(database, `users/${userId}/translatorId`);

  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log('No translatorId found for this user.');
    return null;
  }
};

export const acceptJob = async (translatorId, jobId, jobType) => {
  const db = database;
  const jobRef = ref(db, `admin-jobs/pending/${jobId}`);
  const pendingJobsRef = ref(db, 'admin-jobs/pending');

  const jobSnapshot = await get(jobRef);
  if (
    jobSnapshot.exists() &&
    jobSnapshot.child('translatorId').val() &&
    jobSnapshot.child('translatorId').val() !== translatorId
  ) {
    console.log('This job is already taken by another translator.');
    throw new Error('This job is already taken by another translator.');
  }

  const pendingJobsSnapshot = await get(pendingJobsRef);
  if (pendingJobsSnapshot.exists()) {
    let hasOtherJobs = false;
    pendingJobsSnapshot.forEach((childSnapshot) => {
      if (
        childSnapshot.key !== jobId &&
        childSnapshot.child('translatorId').val() === translatorId
      ) {
        hasOtherJobs = true;
      }
    });

    if (hasOtherJobs) {
      throw new Error('Translator already has a pending job.');
    }
  }

  if (
    !jobSnapshot.exists() ||
    jobSnapshot.child('translatorId').val() === null ||
    jobSnapshot.child('translatorId').val() === translatorId
  ) {
    if (jobType== "overlay"){
      await update(jobRef, {
        translatorId: translatorId,
        overlaysStatus: serverTimestamp(),
      });
    }else if (jobType == "moderation"){
      await update(jobRef, {
        translatorId: translatorId,
        moderationStatus: serverTimestamp(),
      });
    }else if (jobType == "pending"){
      await update(jobRef, {
        translatorId: translatorId,
        pendingStatus: serverTimestamp(),
      })
    }
    
    console.log('Job accepted successfully.');
  } else {
    throw new Error('Job cannot be accepted.');
  }
};

export const flagOverlayJob = async (jobId) => {
  const jobRef = ref(database, `admin-jobs/pending/${jobId}`);
  await update(jobRef, { overlaysStatus: 'flagged' });
};

export const verifyTranslator = async (translatorId, jobId) => {
  const translatorRef = ref(
    database,
    `admin-jobs/pending/${jobId}/translatorId`
  );
  const snapshot = await get(translatorRef);

  if (!snapshot.exists()) {
    return false;
  }

  const fetchedTranslatorId = snapshot.val();
  return fetchedTranslatorId === translatorId;
};

export const attachTranslatorToModerationJob = async (translatorId, jobId) => {
  const jobRef = ref(database, `admin-jobs/pending/${jobId}/`);

  await update(jobRef, { translatorId: translatorId });
};
