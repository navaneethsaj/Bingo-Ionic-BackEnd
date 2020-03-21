const port = process.env.PORT || 3200;
const express = require('express');
var cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var session = require('express-session');
const Fuse = require('fuse.js');
const _ = require('lodash');
var MemoryStore = require('memorystore')(session);
const origin = ['http://localhost'];
const auth = require('./endpoints/authentication');
const ret = require('./endpoints/play.game')(io);
const play = ret[0];
const gameRoomCollection = ret[1];
io.set('origins', origin);
io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    socket.on('disconnect', ()=>{
        console.log('disconnected', socket.id)
    });
    socket.on('searchtext', (msg) => {
        console.log('searchtext', msg);
        let options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            minMatchCharLength: 1,
            keys: [
                "roomname",
            ]
        };
        let fuse = new Fuse(_.values(gameRoomCollection), options);
        let result = fuse.search(msg);
        let searchres = [];
        for (let item of result){
            searchres.push(item.item.roomname);
        }
        socket.emit('searchresult', searchres)
    })
});
app.use(cors({origin: origin, credentials:true}));
app.use(express.json());
app.use(express.urlencoded());
app.use(session(
    {
        secret: "asg76gsfg67ty8s7daft66t8s76fts876f",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000 * 30, // 30 days
            httpOnly: false // <- set httpOnly to false
        },
        store: new MemoryStore({
            checkPeriod: 43200000 // prune expired entries every 14h
        }),
    }));
app.use('/auth', auth);
app.use('/play',play);
app.get('', (req, res) => {
    res.send('server running')
});
http.listen(port, ()=>{
    console.log('listening on http://localhost:'+ port)
});
