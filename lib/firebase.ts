/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, getDocFromServer } from 'firebase/firestore';

let firebaseData: any = null;
try {
  firebaseData = require('../firebase-applet-config.json');
} catch (e) {
  console.warn('Firebase config missing.');
}

const app = getApps().length === 0 && firebaseData ? initializeApp(firebaseData) : (getApps().length > 0 ? getApps()[0] : null);

export const db = app && firebaseData ? getFirestore(app, firebaseData.firestoreDatabaseId) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export async function signIn() {
  if (!auth) return;
  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  if (!auth) return;
  return auth.signOut();
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Firestore Error: ', error, operationType, path);
  throw new Error('Firestore Error');
}
