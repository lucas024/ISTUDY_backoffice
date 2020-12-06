const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

var database = admin.firestore();

 // Create and Deploy Your First Cloud Functions
 // https://firebase.google.com/docs/functions/write-firebase-functions
 /*  if (table["reservation"]["duration"] === null
                    || table["reservation"]["endTime"] < Date.now())
                    continue;
                table["reservation"].update({
                    duration: null,
                    endTime: null,
                    initTime: null,
                    istID: null
                });
                table.update({
                   state: 0
                }) */


exports.scheduledFunction2 = functions.pubsub.schedule('every 1 minutes').onRun((context) => {

  database.collection("tecnico2").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          let getRooms = doc.data().rooms
          const reservation = {
            duration:null,
            endTime:null,
            initTime:null,
            istID:null
        }
          for (var room of getRooms) {
            let indexRoom = getRooms.findIndex(e =>  {return e.name === room.name})
            for (var table of room.tables) {
                let getTables = room.tables
                let indexTable = room.tables.findIndex(e =>  {return e.name === table.name})
                getTables[indexTable].reservation = reservation
                getTables[indexTable].state = 0
                getRooms[indexRoom].update({
                    tables:getTables
                })
              
            }
          }
      });
      return null;
  }).catch(error => { console.log(error.toString())});
  return null;
});

