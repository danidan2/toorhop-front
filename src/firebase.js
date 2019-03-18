import { auth, initializeApp } from 'firebase'

var firebaseConfig = {}
if (process.env.NODE_ENV === 'development') {
  firebaseConfig = {
    apiKey: 'AIzaSyBHxHBXC3BnWft_d63T3HNNRY7zocrJwA4',
    authDomain: 'toorhop-62389.firebaseapp.com',
    databaseURL: 'https://toorhop-62389.firebaseio.com',
    projectId: 'toorhop-62389',
    storageBucket: 'gs://toorhop-62389.appspot.com',
    messagingSenderId: '988555464702'
  }
} else {
  firebaseConfig = {
    apiKey: 'AIzaSyD0RWE-lFq25ZeKXwKMyroUATUIwPavbgc',
    authDomain: 'toorhop-live.firebaseapp.com',
    databaseURL: 'https://toorhop-live.firebaseio.com',
    projectId: 'toorhop-live',
    storageBucket: 'gs://toorhop-live.appspot.com',
    messagingSenderId: '196434967415'
  }
}

export const firebase = initializeApp(firebaseConfig)
export const googleProvider = new auth.GoogleAuthProvider()
export const facebookProvider = new auth.FacebookAuthProvider()
export const db = firebase.database()
