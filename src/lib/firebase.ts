
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWGZ3Sq2qTIO5aH1mRkg9XIXPlJmujHFw",
  authDomain: "dev-qa-93069.firebaseapp.com",
  projectId: "dev-qa-93069",
  storageBucket: "dev-qa-93069.firebasestorage.app",
  messagingSenderId: "869126019569",
  appId: "1:869126019569:web:6bf9d2c3c063ba40c1cc50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  googleProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
};
