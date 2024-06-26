import { initializeApp, FirebaseOptions, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();

const storage = getStorage();

export const uploadBuffer = async (
  buffer: Buffer,
  filePath: string
): Promise<string> => {
  const fileRef = ref(storage, filePath);
  const uploadResult = await uploadBytes(fileRef, buffer);
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  return downloadUrl;
};
