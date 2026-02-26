// Firebase client initialization: reads keys from Vite env vars (keep secrets out of source)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDKsGrzt98IlEPKs7W6UiD9Ta3tmNpYbQ0",
//   authDomain: "timesync-7dabe.firebaseapp.com",
//   projectId: "timesync-7dabe",
//   storageBucket: "timesync-7dabe.firebasestorage.app",
//   messagingSenderId: "976457411909",
//   appId: "1:976457411909:web:17bb8206b50f043d30a22c"
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// will open popup and generate a frontend token for backend
export async function signInWithProviderPopup(provider) {
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { result, idToken };
}

export async function signInWithGooglePopup() {
  return signInWithProviderPopup(googleProvider);
}

export async function signInWithFacebookPopup() {
  return signInWithProviderPopup(facebookProvider);
}

export { app, auth, googleProvider, facebookProvider };
