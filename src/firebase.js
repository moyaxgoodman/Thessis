import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyAYMUAk9UnLp6yh0M2fWLFtxd8JN_l2uO0",
  authDomain: "upload-file-f6d79.firebaseapp.com",
  projectId: "upload-file-f6d79",
  storageBucket: "upload-file-f6d79.appspot.com",
  messagingSenderId: "53143058004",
  appId: "1:53143058004:web:e4eb8fed95e923e7bd5fc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)