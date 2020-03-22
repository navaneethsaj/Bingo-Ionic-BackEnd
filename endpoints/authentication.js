const express = require('express');
const router = express.Router();
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const authDB = globals.authDbName;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const ObjectID = require('mongodb').ObjectID;

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
    res.send('auth server running');
});
router.post('/login', (req, res) => {
    let creds = {
        email: req.body.email,
        password: req.body.password,
        score: req.body.score
    };
    let db = client.db(authDB);
    db.collection('players').findOne({email: creds.email, password: creds.password}, (err, doc) => {
        if (err){
            console.log(err);
            res.send({status: 202, msg: 'db error'});
            return
        }
        if (doc !== null){
            // valid login
            updateScore(doc._id, doc.score, doc.username);
            console.log('valid')
        }else {
            console.log(doc);
            res.send({status: 201, msg: 'Invalid Credentials'});
        }
    });

    function updateScore(id, oldscore, username){
        try{
            db.collection('players').updateOne({email :creds.email}, {$inc: {score: creds.score}}, (err, result) =>{
                if (err){
                    console.log(err);
                    return;
                }
                res.send({status: 200, msg: 'Success', id: id, score: oldscore + creds.score, username})

            });
        }catch (e) {
            console.log(e);
            res.send({status: 201, msg: 'err'});
        }
    }

});

router.post('/register', (req, res) => {
    let creds = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        score: Number(req.body.score) || 0
    };
    if(creds.email === undefined || creds.password === undefined || creds.username === undefined){
        res.send({status: 201, msg: 'error'});
        return
    }
    let db = client.db(authDB);
    db.collection('players').findOne({email: creds.email}, (err, doc) => {
        if (err){
            console.log(err);
            res.send({status: 202, msg: 'db error'});
            return
        }
        if (doc !== null){
            res.send({status: 203, msg: 'Email Id exists. Try login in'});
            return
        }
        db.collection('players').insertOne(creds, (err, r) => {
            if (err){
                console.log(err);
                res.send({status: 204, msg: 'db error'});
                return
            }
            if (r.insertedCount !== 1){
                res.send({status: 205, msg: 'insert count !=1 error'});
                return
            }
            console.log(r);
            res.send({status: 200, msg: 'Success', id: r["ops"][0]["_id"], username: creds.username});
        })
    });
});

router.get('/logout', (req, res) => {
    res.send('Logout')
});

module.exports = router;
