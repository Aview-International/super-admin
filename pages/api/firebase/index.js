import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue, query, orderByChild, equalTo, update, serverTimestamp  } from 'firebase/database';

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

export const getAllJobsUnderReview = async (callback) => {
  const database = getDatabase();
  const jobsRef = ref(database, 'user-jobs/pending');

  get(jobsRef).then((usersSnapshot) => {
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
  }).catch((error) => {
      console.error("Firebase read failed: ", error);
  });
};
export const getAllPendingTranscriptionsApproval = async (callback) => {
  const transcriptionRef = ref(database, `admin-jobs/pending/transcription-approve`);
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

export const getPendingTranslation = async (jobId, callback) => {
  console.log(`Job ID: ${jobId}`);
  const translationRef = ref(database, `admin-jobs/pending/${jobId}`);
  // Listen for value changes
  try {
  onValue(translationRef, (snapshot) => {
    const jobData = snapshot.val();
    if (jobData) {
      callback(snapshot.val());
    }

  });
  }catch(error){
    console.log("error" + error)
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

export const getSubtitledAndCaptionedJobs = async () => {
  const res = await get(ref(database, `admin-jobs/pending`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        const allJobs = snapshot.val();
        const filteredJobs = Object.keys(allJobs).reduce((acc, key) => {
          const job = allJobs[key];
          if (job['status'] == "subtitling" && job['overlaysStatus'] == null) {
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
          if (job['status'] == "subtitling" && job['overlaysStatus'] == "flagged") {
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
}

export const acceptOverlayJob = async (translatorId, jobId) => {
  const db = database;
  const jobRef = ref(db, `admin-jobs/pending/${jobId}`);
  const pendingJobsRef = ref(db, 'admin-jobs/pending');

  const jobSnapshot = await get(jobRef);
  // Check if the job is already taken by a different translator.
  if (jobSnapshot.exists() && jobSnapshot.child('translatorId').val() && jobSnapshot.child('translatorId').val() !== translatorId) {
    console.log('This job is already taken by another translator.');
    throw new Error('This job is already taken by another translator.');
  }

  // Check if the translator is assigned to any other pending job.
  const pendingJobsSnapshot = await get(pendingJobsRef);
  if (pendingJobsSnapshot.exists()) {
    let hasOtherJobs = false;
    pendingJobsSnapshot.forEach((childSnapshot) => {
      if (childSnapshot.key !== jobId && childSnapshot.child('translatorId').val() === translatorId) {
        hasOtherJobs = true;
      }
    });

    if (hasOtherJobs) {
      throw new Error('Translator already has a pending job.');
    }
  }

  // If all checks pass, assign the translator to the job.
  if (!jobSnapshot.exists() || jobSnapshot.child('translatorId').val() === null || jobSnapshot.child('translatorId').val() === translatorId) {
    await update(jobRef, { translatorId: translatorId, overlaysStatus: serverTimestamp() });
    console.log('Job accepted successfully.');
  } else {
    // This case should theoretically never be reached due to earlier checks.
    throw new Error('Job cannot be accepted.');
  }
};

export const flagOverlayJob = async (jobId) => {
  const jobRef = ref(database, `admin-jobs/pending/${jobId}`);
  await update(jobRef, { overlaysStatus: 'flagged' });
}


export const addTranslatorIdToUser = async (translatorId, userId) => {
  const userRef = ref(database, 'users/' + userId);
  
  await update(userRef, {
    translatorId: translatorId
  });

};

export const verifyTranslator = async (translatorId, jobId) => {
  const translatorRef = ref(database, `admin-jobs/pending/${jobId}/translatorId`);
  const snapshot = await get(translatorRef);

  if (!snapshot.exists()) {
    return false;
  }

  const fetchedTranslatorId = snapshot.val();
  return fetchedTranslatorId === translatorId;
}