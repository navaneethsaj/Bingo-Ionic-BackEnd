const express = require('express');
const _ = require('lodash');
const router = express.Router();
const AsyncLock = require('async-lock');
const gameRoomCollection = {};
const gameRoomCollectionLock = new AsyncLock();
const roomSize = 4;
let io = undefined;
const globals = require('../creds/mongoDB');
const uri = globals.uri;
const playLogDB = globals.playLogDB;
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
    res.send('play server running');
});
router.post('/create', (req, res) => {
    try {
        let db = client.db(playLogDB);
        const roomName = req.body.roomname;
        const socketId = req.body.socketid;
        const playername = req.body.username || 'Guest';
        if (roomName === undefined || socketId === undefined || roomName.length<1){
            res.send({status: 201, msg: 'invalid data'});
            return
        }
        if (roomName.length > 20){
            res.send({status: 201, msg: 'invalid data'});
            return
        }
        gameRoomCollectionLock.acquire(roomName, (done) => {
            if (gameRoomCollection[roomName] !== undefined){
                res.send({status: 202, msg: 'room already exists'});
                done();
                return;
            }
            const socket = io.sockets.connected[socketId];
            gameRoomCollection[roomName] = {};
            gameRoomCollection[roomName]['roomname'] = roomName;
            gameRoomCollection[roomName]['playername'] = [];
            gameRoomCollection[roomName]['playername'].push(playername);
            gameRoomCollection[roomName]['sockets'] = [];
            gameRoomCollection[roomName]['sockets'].push(socket);
            gameManager(roomName);
            gameRoomCollection[roomName]['createdOn'] = new Date();
            res.send({status: 200, msg: 'success'});
            done();
            try{
                db.collection('playlogs').insertOne({action: 'created', roomname: roomName, time: new Date()}, (err, r) => {
                    if (err){
                        console.log(err);
                    }
                })
            }catch (e) {

            }
        })
    }catch (e) {

    }
});
router.post('/join', (req, res) => {
    try{
        const roomName = req.body.roomname;
        const socketId = req.body.socketid;
        const playername = req.body.username || 'Guest';
        if (roomName === undefined || socketId === undefined){
            res.send({status: 201, msg: 'invalid data'});
            return
        }
        if (gameRoomCollection[roomName] === undefined){
            res.send({status: 204, msg: 'room does not exists'});
            return;
        }
        const socket = io.sockets.connected[socketId];
        if (gameRoomCollection[roomName]['sockets'].includes(socket)){
            res.send({status: 203, msg: 'Rejoined'});
            return;
        }
        if (gameRoomCollection[roomName]['sockets'].length >= roomSize){
            res.send({status: 205, msg: 'Room Full'});
            return;
        }
        if (gameRoomCollection[roomName]['started']){
            res.send({status: 206, msg: 'Game Already Started'});
            return;
        }
        if (gameRoomCollection[roomName]['botplay']){
            res.send({status: 207, msg: 'Opponent Playing with BOT'});
            return;
        }
        gameRoomCollection[roomName]['playername'].push(playername);
        gameRoomCollection[roomName]['sockets'].push(socket);
        res.send({status: 200, msg: 'success'});
        let db = client.db(playLogDB);
        try{
            db.collection('playlogs').insertOne({action: 'joined', roomname: roomName, time: new Date()}, (err, r) => {
                if (err){
                    console.log(err);
                }
            })
        }catch (e) {

        }
    } catch (e) {

    }
});

async function gameManager(roomName) {
    const ERR_CODES = {
        WRONG_PLAYER: {status: 600, msg: 'Not your turn.'},
        ALREADY_STRIKED: {status: 601, msg: 'Already striked'}
    };
    let listenerAddLock = new AsyncLock();
    let playerTurnLock = new AsyncLock();
    let playerGrids = [];
    let strikerValues = [];
    let bingoScore = [];
    let wonPlayers = [];
    let botgridValues = [];
    let numberOfPlayers = 0;
    let playerTurn = 0;
    let nextWinPosition = 1;
    const sockets = gameRoomCollection[roomName].sockets;
    let manager = setInterval(() => {
        addListener();
    }, 1000);
    let turnbroadcaster = setInterval(broadcastTurn, 1000);

    async function addListener() {
        try{
            listenerAddLock.acquire(roomName, (done) => {
                try{
                    if (numberOfPlayers < sockets.length) {
                        console.log('added listener', 'Player', numberOfPlayers + 1);
                        console.log('number of players in room', numberOfPlayers + 1);
                        playerGrids[numberOfPlayers] = null;
                        bingoScore[numberOfPlayers] = 0;

                        // binded player index is not used
                        sockets[numberOfPlayers].on('played', function (msg) {
                            gameRoomCollection[roomName]['started'] = true;
                            const playerIndex = sockets.indexOf(this.currentSocket);
                            console.log(msg, ' - Player ' + playerIndex);
                            if (playerTurn === playerIndex) {
                                if (!strikerValues.includes(msg)) {
                                    broadcast(roomName, 'played', msg);
                                    strikerValues.push(msg);
                                    checkStatus();
                                    playerTurnLock.acquire('lock', (done)=>{
                                        playerTurn = ++playerTurn % numberOfPlayers;
                                        if (wonPlayers.includes(playerTurn)) {
                                            playerTurn = ++playerTurn % numberOfPlayers;
                                        }
                                        console.log('next player', playerTurn);

                                        // deprecated
                                        function botplay() {
                                            playerTurn = 1;
                                            for (let val of botgridValues){
                                                if (!strikerValues.includes(val)){
                                                    strikerValues.push(val);
                                                    console.log('botplayed', val);
                                                    setTimeout(()=>{
                                                        sockets[0].emit('played', val);
                                                        playerTurn = 0;
                                                    }, 1200);
                                                    return
                                                }
                                            }
                                        }

                                        try{
                                            if (gameRoomCollection[roomName]['botplay']){
                                                botplay()
                                            }
                                        }catch (e) {

                                        }
                                        done()
                                    });
                                } else {
                                    this.currentSocket.emit('err', ERR_CODES.ALREADY_STRIKED);
                                    console.log('already striked');
                                }

                            }
                            else {
                                this.currentSocket.emit('err', ERR_CODES.WRONG_PLAYER);
                                console.log('incorrect player');
                            }
                        }.bind({currentSocket: sockets[numberOfPlayers], playerIndex: Number(numberOfPlayers)}));
                        sockets[numberOfPlayers].on('gridValues', function (msg) {
                            const playerIndex = sockets.indexOf(this.currentSocket);
                            playerGrids[playerIndex] = msg;
                        }.bind({currentSocket: sockets[numberOfPlayers], playerIndex: Number(numberOfPlayers)}));
                        sockets[numberOfPlayers].on('disconnect', function (msg) {
                            // console.log(msg, this.currentSocket.id, this.playerIndex);
                            cleanUpPlayerData(this.currentSocket)
                        }.bind({currentSocket: sockets[numberOfPlayers], playerIndex: Number(numberOfPlayers)}));
                        sockets[numberOfPlayers].on('botplay', (msg) => {
                            if (numberOfPlayers < 2){
                                console.log('bot play started');
                                gameRoomCollection[roomName]['botplay'] = true;
                                botgridValues = _.range(1, 26);
                                botgridValues = _.shuffle(botgridValues);
                                playerGrids.push(botgridValues);
                            }
                        });
                        sockets[numberOfPlayers].on('chatted', function (msg) {
                            console.log('chat', msg);
                            broadcast(roomName, 'chat', {id: msg.id, msg: msg.msg});
                        }.bind({playerIndex: Number(numberOfPlayers)}));
                        sockets[numberOfPlayers].emit('handshake1', 'ok' + numberOfPlayers);
                        sockets[numberOfPlayers].emit('handshake2', strikerValues);
                        sockets[numberOfPlayers].emit('handshake3', numberOfPlayers + 1);
                        broadcast(roomName, 'playerjoined', numberOfPlayers + 1);
                        broadcast(roomName, 'playernames', {playername: gameRoomCollection[roomName].playername || []});
                        numberOfPlayers += 1;
                    }
                    else if (numberOfPlayers > sockets.length) {
                        console.log('more no of players')
                    }
                    done();
                }
                catch (e) {
                    done()
                }
            }, null, null);
        }
        catch (e) {
            console.log()
        }
    }

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

    function broadcastTurn() {
        playerTurnLock.acquire('lock', (done) => {
            broadcast(roomName, 'playerturn', playerTurn+1);
            done()
        });
        // console.log('playerturn', playerTurn+1)
    }

    function cleanUpPlayerData(currentSocket) {
        try{
            let index;
            try{
                index = sockets.indexOf(currentSocket);
            }catch (e) {
                return
            }
            gameRoomCollection[roomName]['playername'].splice(index, 1);
            sockets.splice(index, 1);
            broadcast(roomName, 'playerexit', index + 1);
            playerGrids.splice(index, 1);
            bingoScore.splice(index, 1);
            numberOfPlayers--;
            playerTurnLock.acquire('lock', (done) => {
                playerTurn = playerTurn % numberOfPlayers;
                done();
            });
            if (wonPlayers.includes(index)) {
                wonPlayers.splice(wonPlayers.indexOf(index), 1);
            }
            console.log('removed socket of player', index);
            console.log('no of players in room', numberOfPlayers);
            if (numberOfPlayers < 1) {
                cleanUpRoom();
                console.log('deleting room', roomName);
            }
            broadCastNewPlayerId()
        } catch (e) {

        }
    }

    function broadCastNewPlayerId() {
        for (let sock of sockets) {
            try{
                sock.emit("newplayerid", {playerid: sockets.indexOf(sock) + 1, total: sockets.length,
                    playername: gameRoomCollection[roomName].playername || []});
            }catch (e) {

            }
        }
    }

    function checkStatus() {
        try{
            playerGrids.forEach((grid) => {
                let score = 0;
                const index = playerGrids.indexOf(grid);
                // horizontal & vertical score
                for (let i of _.range(0, 5)) {
                    let horizontalStrike = true;
                    for (let j of _.range(0, 5)) {
                        let idx = i * 5 + j;
                        horizontalStrike = strikerValues.includes(grid[idx]);
                        if (!horizontalStrike) {
                            break
                        }
                    }
                    if (horizontalStrike) {
                        score++;
                    }
                    let verticalStrike = true;
                    for (let j of _.range(0, 5)) {
                        let idx = i + j * 5;
                        verticalStrike = strikerValues.includes(grid[idx]);
                        if (!verticalStrike) {
                            break
                        }
                    }
                    if (verticalStrike) {
                        score++;
                    }
                }
                // diagonal score
                let diagonalStrike = true;
                for (let j of _.range(0, 5)) {
                    let idx = j * 6;
                    diagonalStrike = strikerValues.includes(grid[idx]);
                    if (!diagonalStrike) {
                        break
                    }
                }
                if (diagonalStrike) {
                    score++
                }
                diagonalStrike = true;
                for (let j of _.range(1, 6)) {
                    let idx = j * 4;
                    diagonalStrike = strikerValues.includes(grid[idx]);
                    if (!diagonalStrike) {
                        break
                    }
                }
                if (diagonalStrike) {
                    score++
                }
                bingoScore[index] = score;
                try{
                    sockets[index].emit('points', score);
                }catch (e) {
                    console.log('bot play')
                }
                if (score >= 5 && !wonPlayers.includes(index)) {
                    console.log('position', nextWinPosition, 'player', index + 1);
                    broadcast(roomName, 'win', {position: nextWinPosition, player: index + 1});
                    try{
                        console.log('you won', index);
                        sockets[index].emit('youwon', {msg: 'Yay, You Won', position: nextWinPosition});
                        console.log('nextwin pos- pre', nextWinPosition);
                        // if (gameRoomCollection[roomName]['botplay']){
                        //     sockets[0].emit('botwon', 'You Were Defeated By Bot');
                        // }
                    }catch (e) {
                        // reaches here when playing with bot
                        // console.log(e)
                    }
                    nextWinPosition++;
                    wonPlayers.push(index);
                    if (nextWinPosition >= numberOfPlayers) {
                        console.log('GameOver');
                        broadcast(roomName, 'gameover', 'Game Over');
                        let db = client.db(playLogDB);
                        try{
                            db.collection('playlogs').insertOne({action: 'gameover', roomname: roomName, time: new Date()}, (err, r) => {
                                if (err){
                                    console.log(err);
                                }
                            })
                        }catch (e) {

                        }
                        cleanUpRoom();
                    }
                }
            });
        }catch (e) {
            console.log(e);
        }
        console.log(bingoScore)
    }

    function cleanUpRoom() {
        listenerAddLock.acquire(roomName, (done) => {
           try{
               let sockets = gameRoomCollection[roomName].sockets;
               for (let sock of sockets){
                   try{
                       sock.removeAllListeners();
                   }catch (e) {

                   }
               }
           } catch (e) {

           }
            done()
        });
        clearInterval(manager);
        clearInterval(turnbroadcaster);
        gameRoomCollectionLock.acquire(roomName, (done) => {
            delete gameRoomCollection[roomName];
            done();
        });
    }
}
async function garbageCollector(){
    for (let room in gameRoomCollection){
        if (new Date() - gameRoomCollection[room].createdOn > 1000 * 60 * 60 * 3){
            // remove room living more than 3 hour
            gameRoomCollectionLock.acquire(room, (done) => {
                try{
                    delete gameRoomCollection[room];
                }catch (e) {

                }
                done()
            });
        }
    }
    // console.log('garbage', gameRoomCollection, new Date());
}

setInterval(garbageCollector, 2000); // change to bigger value

module.exports = function (io_ref) {
    io = io_ref;
    return [router, gameRoomCollection];
};
