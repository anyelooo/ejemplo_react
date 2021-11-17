import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCg2hv1FUtgNBIbgHfZJKvRwmJn842g4XA",
    authDomain: "pruevawpa.firebaseapp.com",
    projectId: "pruevawpa",
    storageBucket: "pruevawpa.appspot.com",
    messagingSenderId: "15894749285",
    appId: "1:15894749285:web:cf15f6eda2c1c83764268c"
  };

export const firebaseApp=firebase.initializeApp(firebaseConfig)