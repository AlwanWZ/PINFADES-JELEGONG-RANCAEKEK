

import {
  collection,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName));
  const data = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
  const docSnap = await getDoc(doc(db, collectionName, id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}