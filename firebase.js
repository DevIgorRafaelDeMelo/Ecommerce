import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBE--xApSmQghnNMbd9hvmt15BpkVD2Pb4",
  authDomain: "distribuidora-84477.firebaseapp.com",
  projectId: "distribuidora-84477",
  storageBucket: "distribuidora-84477.firebasestorage.app",
  messagingSenderId: "695333103634",
  appId: "1:695333103634:web:972ddda09a16346a7a50cb",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
