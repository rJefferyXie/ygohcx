import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUEirgnSYwqx2qchLofokKne5oZydaW4c",
  authDomain: "ygohcx.firebaseapp.com",
  projectId: "ygohcx",
  storageBucket: "ygohcx.appspot.com",
  messagingSenderId: "67075028016",
  appId: "1:67075028016:web:3a06d91abc61dbd97aa9f5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  app,
  db
}