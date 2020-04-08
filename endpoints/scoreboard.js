const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const authDB = globals.authDbName;
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
   const db = client.db(authDB);
   db.collection('players').find().project({username: 1, score: 1, _id: 0}).sort({score: -1}).limit(200).toArray((err, result) => {
       if (err){
           console.log(err);
           res.send({ranks: []});
           return
       }
       res.send({ranks: result})
   })
});

router.post('/my', (req, res) => {
    let id = req.body.id;
    const db = client.db(authDB);
    db.collection('players').find().sort({score: -1}).toArray((err, result) => {
        if (err){
            console.log(err);
            res.send({ranks: 0});
            return
        }
        console.log('calculating myrank');
        let ranks = 0;
        for (const i of result){
            ranks ++;
            if (i._id.toString() === id){
                break;
            }
        }
        console.log('my rank', ranks);
        res.send({ranks: ranks});
    })

});

router.post('/updatescore', (req, res) => {
    let id = req.body.id;
    const db = client.db(authDB);
    try{
        db.collection('players').updateOne({_id :ObjectID(id)}, {$inc: {score: 1}}, (err, result) =>{
            if (err){
                return;
            }
            db.collection('players').findOne({_id: ObjectID(id)}, (err, doc) => {
                if (err){
                    console.log(err);
                    return
                }
                if (doc === undefined){
                    return;
                }
                if (doc !== null) {
                    res.send({status: 200, msg: 'Success', score: doc.score})
                }
            })
        });
    }catch (e) {
        console.log(e);
        res.send({status: 201, msg: 'err'});
    }
});

module.exports = router;
