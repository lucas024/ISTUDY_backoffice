import firebase from 'firebase/app'
import 'firebase/firestore'
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

var app = firebase.initializeApp({
    apiKey: "AIzaSyCOcHxgWASE3jteTSpQClzqH10B3tX35bk",
    authDomain: "istudy-half.firebaseapp.com",
    databaseURL: "https://istudy-half.firebaseio.com",
    projectId: "istudy-half",
    storageBucket: "istudy-half.appspot.com",
    messagingSenderId: "1015525937082",
    appId: "1:1015525937082:web:dc0aa35612734d036f5783",
    measurementId: "G-7JSQLFLKCN"
})

const firestore = firebase.firestore()


export  {
    firestore, app as default
  }

