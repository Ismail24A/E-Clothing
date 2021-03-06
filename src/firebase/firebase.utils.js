import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDk5mkQVhhI5BhfAHKZD3CydnzeIytF9Mw",
    authDomain: "e-clothing-db-2e653.firebaseapp.com",
    databaseURL: "https://e-clothing-db-2e653.firebaseio.com",
    projectId: "e-clothing-db-2e653",
    storageBucket: "e-clothing-db-2e653.appspot.com",
    messagingSenderId: "23529814391",
    appId: "1:23529814391:web:881fcab1d0388213c4c972",
    measurementId: "G-MHFYBVCZ7Z"
  };
  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return ;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
      const {displayName, email} = userAuth;
      const createdAt = new Date();

      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.log('error creating user', error.message);
      }
    }
    return userRef;
  }

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);

    const batch = firestore.batch();

    objectsToAdd.forEach(obj => {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
    });

    return await batch.commit();
  };

  export const convertCollectionsSnapshotToMap = collections =>{
    const transformedCollection = collections.docs.map(doc => {
      const {title, items} = doc.data();
      return {
        routeName: encodeURI(title.toLowerCase()),
        id: doc.id,
        title,
        items
      }
    });
    return transformedCollection.reduce( (acc, collection) => {
      acc[collection.title.toLowerCase()] = collection;
      return acc;
    }, {});
  };


  firebase.initializeApp(config);

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;



