const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const authDbName = globals.authDbName;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let activeUsers = {};

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

router.post('/my', (req, res) => {

});

router.get('/all', (req, res) => {
    let db = client.db(authDbName);
    let result = {status: 200};
    try{
        let users = [];
        for (let user in activeUsers){
            try{
                console.log(new Date() - activeUsers[user].lastActive);
                if (new Date() - activeUsers[user].lastActive < 10000){
                    users.push(ObjectID(user))
                }else {
                    delete activeUsers[user];
                    console.log('deleted ', user)
                }
            }catch (e) {
                console.log(e)
            }
        }
        console.log(users);
        db.collection('players').find({_id: {$in: users}}).limit(200).project({username: 1, score: 1}).toArray((err, r) => {
            if (err){
                console.log(err);
                res.send({status: 202,});
                return
            }
            console.log(r);
            result.active = r;
            db.collection('players').find({_id: {$nin: users}}).limit(100 + 200-r.length).project({username: 1, score: 1}).toArray((err, r) => {
                if (err){
                    console.log(err);
                    res.send({status: 202,});
                    return
                }
                result.inactive = r;
                res.send(result);
            });
        })
    }catch (e) {
        console.log(e);
    }
});

router.post('/challenge', (req, res) => {
    let targetUid = req.body.targetUid;
    let myUid = req.body.myUid;
    let myName = req.body.myName;
    let roomno = req.body.roomno;
    try{
        activeUsers[targetUid].socket.emit('challenged', {
            msg: myName + ' Challenged You',
            challengerUid: myUid,
            challengerName: myName,
            roomno
        });
        res.send({status: 200})
    }catch (e) {
        console.log(e);
        res.send({status: 202})
    }
});

router.post('/closingapp', (req, res) => {
    let targetUid = req.body.targetUid;
    let myUid = req.body.myUid;
    let myName = req.body.myName;
    console.log('closing');
    try{
        delete activeUsers[myUid];
        console.log('removed ', myUid);
        console.log(activeUsers);
        res.send({status: 200})
    }catch (e) {
        console.log(e);
        res.send({status: 202})
    }
});

router.post('/accept', (req, res) => {
    let targetUid = req.body.targetUid;
    let myUid = req.body.myUid;
    let myName = req.body.myName;
    let status = req.body.status;
    console.log(targetUid, myName, myUid, status);
    try{
        if (status){
            activeUsers[targetUid].socket.emit('challengeresponse', {
                msg: myName + ' Accepted Your Challenge',
                oppositUid: myUid,
                oppositName: myName
            })
        }else {
            activeUsers[targetUid].socket.emit('challengeresponse', {
                msg: myName + ' Rejected Your Challenge',
                oppositUid: myUid,
                oppositName: myName
            })
        }
        res.send({status: 200})
    }catch (e) {
        console.log(e);
        res.send({status: 202})
    }
});

module.exports = function (active) {
    activeUsers = active;
    return router
};
