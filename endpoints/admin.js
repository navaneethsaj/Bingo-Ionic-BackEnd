const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const authDB = globals.authDbName;
const playLogDB = globals.playLogDB;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let gameRoomCollection = null;
const moment = require('moment');


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

router.post('/login', (req, res) => {
    if (req.body.username === 'admin123456' && req.body.password === 'admin123456'){
        req.session.role = 'admin';
        res.send({status: 200, msg: 'loggedIn'});
        console.log('admin login success');
        return
    }
    res.send({status: 201, msg: 'creds wrong'});
    console.error('admin login failed')
});

router.use((req, res, next) =>{
    if (req.session.role !== 'admin'){
        console.log('not admin');
        return
    }
    next()
});

router.post('/room', (req, res) => {
    let responseObj = [];
    try{
        for(let key in gameRoomCollection){
            let obj = {};
            obj.name = gameRoomCollection[key].roomname;
            obj.createdOn = moment(gameRoomCollection[key].createdOn).fromNow();
            obj.playerCount = gameRoomCollection[key].sockets.length;
            obj.botplay = gameRoomCollection[key].botplay;
            obj.started = gameRoomCollection[key].started;
            responseObj.push(obj)
        }
    }catch (e) {

    }
    res.send(responseObj);
});

router.post('/chat/specific', (req, res) => {
    const roomName = req.body.roomname;
    const message = req.body.message;
    broadcast(roomName, 'chat', {id: 'Admin (Bingo5x5)', msg: message});
    res.send({status: 200, msg:'sent'})
});

router.post('/chat/all', (req, res) => {
    const message = req.body.message;
    for (let roomname in gameRoomCollection){
        broadcast(roomname, 'chat', {id: 'Admin (Bingo5x5)', msg: message});
    }
    res.send({status: 200, msg:'sent'})
});

router.post('/chart', (req, res) => {
    let days = req.body.days;
    const time = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
    let db = client.db(playLogDB)
    db.collection('playlogs').find({time: {$gte: time}}).toArray((err, value) => {
        if (err === null){
            res.send(value);
            return
        }
        res.send([])
    })
})

async function broadcast(roomName, event, msg) {
    let sockets;
    try{
        sockets = gameRoomCollection[roomName].sockets;
    }catch (e) {

    }
    try{
        for (const s of sockets) {
            try{
                s.emit(event, msg);
            }catch (e) {

            }
        }
    }catch (e) {

    }
}

module.exports = function (ref_room) {
    gameRoomCollection = ref_room;
    return router;
};
