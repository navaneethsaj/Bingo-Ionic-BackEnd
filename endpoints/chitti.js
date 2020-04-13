const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const playLogDB = globals.playLogDB;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var connected = false;
router.use((req, res, next) => {
    if (connected){
        next()
    }else {
        res.send({status: 290, msg: 'please try again later. db connection not established'})
    }
});

client.connect((err)=>{
    if (err){
        console.log(err);
        console.log('db conn failed '+ __filename.slice(__dirname.length + 1))
    }else {
        console.log('db connected '+ __filename.slice(__dirname.length + 1));
        connected = true
    }
});

router.get('/create', (req, res) => {
    let db = client.db(playLogDB);
    try{
        db.collection('playlogs').insertOne({action: 'chitti_play', roomname: roomName, time: new Date()}, (err, r) => {
            if (err){
                console.log(err);
            }
            console.log('logged chitti create')
        })
    }catch (e) {

    }
    res.send({status: 200});
});

router.get('/gameover', (req, res) => {
    let db = client.db(playLogDB);
    try{
        db.collection('playlogs').insertOne({action: 'chitti_gameover', roomname: roomName, time: new Date()}, (err, r) => {
            if (err){
                console.log(err);
            }
            console.log('logged chitti gameover')
        })
    }catch (e) {

    }
    res.send({status: 200});
});

module.exports = router;
