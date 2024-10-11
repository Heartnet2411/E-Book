// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDCmXjtrnvdhV_i0IML0MtfzmmY8_-IKnQ',
    authDomain: 'datn-ed1fa.firebaseapp.com',
    projectId: 'datn-ed1fa',
    storageBucket: 'datn-ed1fa.appspot.com',
    messagingSenderId: '985266167942',
    appId: '1:985266167942:web:c300bb736b03c14563b107',
    measurementId: 'G-RQRTX3712B',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider,storage };
