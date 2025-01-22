// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBf0fuyIUZ1tqFYGL7c3uo7FLg0h0yGr0g',
  authDomain: 'speed-id-utara.firebaseapp.com',
  databaseURL: 'https://speed-id-utara.firebaseio.com',
  projectId: 'speed-id-utara',
  storageBucket: 'speed-id-utara.appspot.com',
  messagingSenderId: '458477960320',
  appId: '1:458477960320:web:e0e0ae59f724773915fa65',
  measurementId: 'G-XH1QVPS33D'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app)
