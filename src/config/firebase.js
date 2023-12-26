import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyAkK1esLcvSfTe2rNnNYURsoTOKwKd49Ms",
 authDomain: "fir-react-project-48c93.firebaseapp.com",
 projectId: "fir-react-project-48c93",
 storageBucket: "fir-react-project-48c93.appspot.com",
 messagingSenderId: "18541462970",
 appId: "1:18541462970:web:4dd5ac752e671299370983",
 measurementId: "G-5JWVGZGE91",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
