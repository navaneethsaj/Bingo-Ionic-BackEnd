const port = process.env.PORT || 3200;
const express = require('express');
var cors = require('cors');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const AsyncLock = require('async-lock');
const io = require('socket.io')(http);
var session = require('express-session');
const Fuse = require('fuse.js');
const _ = require('lodash');
var MemoryStore = require('memorystore')(session);
const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:8101',
    'http://localhost:3200',
    'https://bingo5x5.herokuapp.com',
    'https://bingo5x5-2.herokuapp.com'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true
};
let activeUsers = {};
const auth = require('./endpoints/authentication');
const ret = require('./endpoints/play.game')(io);
const play = ret[0];
const gameRoomCollection = ret[1];
const activeChatCount = require('./endpoints/chatroom')(io);
const chitti = require('./endpoints/chitti');
const scores = require('./endpoints/scoreboard');
const notifications = require('./endpoints/notifications');
const friends = require('./endpoints/friends')(activeUsers);
const admin = require('./endpoints/admin')(gameRoomCollection);
io.origins('*:*');
let lockUserCount = new AsyncLock();
let activeUserLock = new AsyncLock()
let allSocketCount = 0;
io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    lockUserCount.acquire('user', (done) => {
        allSocketCount++;
        done()
    });
    socket.on('disconnect', ()=>{
        console.log('disconnected', socket.id);
        lockUserCount.acquire('user', (done) => {
            allSocketCount--;
            done()
        })
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
    });
    socket.on('getactive', (msg) => {
        socket.emit('activePlayers', {activeCount : Math.floor((allSocketCount)/2), chatCount: activeChatCount.count});
        // console.log(allSocketCount, activeChatCount)
    });
    socket.on('active', (msg) => {
        activeUserLock.acquire('active', (done) => {
            if (activeUsers[msg.id]){
                activeUsers[msg.id]['socket'] = socket;
                activeUsers[msg.id]['playing'] = msg.playing || false;
                activeUsers[msg.id]['lastActive'] = new Date();
            }else {
                activeUsers[msg.id] = {id: msg.id, lastActive: new Date(), socket: socket, playing: msg.playing || false};
                // console.log('active', activeUsers);
            }
            done()
        })
    })
});
app.use(cors(corsOptions));
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
app.use('/score', scores);
app.use('/admin', admin);
app.use('/chitti', chitti);
app.use('/nots', notifications);
app.use('/friends', friends);
app.use(express.static(path.join(__dirname, 'public/www')));
app.get('/web', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});
app.get('/versionNo', (req, res) => {
    let versionNo = 13;
    res.send({version: versionNo})
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/www', 'index.html'))
});
http.listen(port, ()=>{
    console.log('listening on http://localhost:'+ port)
});
