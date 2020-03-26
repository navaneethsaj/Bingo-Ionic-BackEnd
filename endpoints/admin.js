const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const authDB = globals.authDbName;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let gameRoomCollection = null;
const moment = require('moment');
router.post('/login', (req, res) => {
    console.log('send1');
    if (req.body.username === 'admin123456' && req.body.password === 'admin123456'){
        req.session.role = 'admin';
        res.send({status: 200, msg: 'loggedIn'});
        console.log('send2');
        return
    }
    res.send({status: 201, msg: 'creds wrong'});
    console.log('send3');
});

router.use((req, res, next) =>{
    if (req.session.role !== 'admin'){
        console.log('not admin');
        return
    }
    next()
});

router.post('/room', (req, res) => {
    // console.log('room => ', gameRoomCollection);
    let responseObj = [];
    for(let key in gameRoomCollection){
        let obj = {};
        obj.name = gameRoomCollection[key].roomname;
        obj.createdOn = moment(gameRoomCollection[key].createdOn).fromNow();
        obj.playerCount = gameRoomCollection[key].sockets.length;
        obj.botplay = gameRoomCollection[key].botplay;
        responseObj.push(obj)
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
    const message = req.body.message
    for (let roomname in gameRoomCollection){
        broadcast(roomname, 'chat', {id: 'Admin (Bingo5x5)', msg: message});
    }
    res.send({status: 200, msg:'sent'})
});

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
