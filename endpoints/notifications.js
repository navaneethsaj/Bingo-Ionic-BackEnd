const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const notDB = globals.notificationDB;
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

router.get('', (req, res) => {
   const db = client.db(notDB);
   db.collection('all_nots').find().sort({time: -1}).limit(20).toArray((err, result) => {
       if (err){
           console.log(err);
           res.send({notifications: []});
           return
       }
       res.send({notifications: result});
   })
});

router.post('/add', (req, res) => {
    if (req.session.role !== 'admin'){
        console.log('not admin');
        res.send({status: 202});
        return
    }
    const db = client.db(notDB);
    let not = {
        title: req.body.title,
        desc: req.body.desc,
        time: new Date()
    };
    db.collection('all_nots').insertOne(not,(err, ) => {
        if (err){
            console.log(err);
            res.send({status: 202});
            return
        }
        console.log("1 document inserted");
        res.send({status: 200});
    })
});

module.exports = router;
