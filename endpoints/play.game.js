const express = require('express');
const _ = require('lodash');
const router = express.Router();
const AsyncLock = require('async-lock');
const gameRoomCollection = {};
const roomSize = 4;
let io = undefined;
router.get('', (req, res) => {
    res.send('play server running');
});
router.post('/create', (req, res) => {
    const roomName = req.body.roomname;
    const socketId = req.body.socketid;
    if (roomName === undefined || socketId === undefined || roomName.length<1){
        res.send({status: 201, msg: 'invalid data'});
        return
    }
    if (gameRoomCollection[roomName] !== undefined){
        res.send({status: 202, msg: 'room already exists'});
        return;
    }
    const socket = io.sockets.connected[socketId];
    gameRoomCollection[roomName] = {};
    gameRoomCollection[roomName]['roomname'] = roomName;
    gameRoomCollection[roomName]['sockets'] = [];
    gameRoomCollection[roomName]['sockets'].push(socket);
    gameManager(roomName);
    res.send({status: 200, msg: 'success'});
});
router.post('/join', (req, res) => {
    const roomName = req.body.roomname;
    const socketId = req.body.socketid;
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
    gameRoomCollection[roomName]['sockets'].push(socket);
    res.send({status: 200, msg: 'success'});
});

async function gameManager(roomName){
    const ERR_CODES = {
        WRONG_PLAYER: {status: 600, msg: 'Not your turn.'},
        ALREADY_STRIKED: {status: 601, msg: 'Already striked'}
    };
    let listenerAddLock = new AsyncLock();
    let playerTurnLock = new AsyncLock();
    let playerGrids = [];
    let strikerValues = [];
    let bingoScore = [];
    let numberOfPlayers = 0;
    let playerTurn = 0;
    let nextWinPosition = 1;
    const sockets = gameRoomCollection[roomName].sockets;
    setInterval(() => {
        addListener();
    }, 1000);
    async function addListener(){
        listenerAddLock.acquire(roomName, (done) => {
            if (numberOfPlayers < sockets.length){
                console.log('added listener', 'Player', numberOfPlayers+1);
                console.log('number of players in room', numberOfPlayers+1);
                playerGrids[numberOfPlayers] = null;
                bingoScore[numberOfPlayers] = null;
                sockets[numberOfPlayers].on('played', function (msg){
                    const playerIndex = sockets.indexOf(this.currentSocket);
                    console.log(msg, ' - Player '+ playerIndex);
                    if (playerTurn === playerIndex){
                        if (!strikerValues.includes(msg)){
                            broadcast(roomName, 'played', msg);
                            strikerValues.push(msg);
                            playerTurn = ++playerTurn % numberOfPlayers;
                            checkStatus();
                            console.log('next player', playerTurn);
                        }else {
                            this.currentSocket.emit('err', ERR_CODES.ALREADY_STRIKED);
                            console.log('already striked');
                        }

                    }else {
                        this.currentSocket.emit('err', ERR_CODES.WRONG_PLAYER);
                        console.log('incorrect player');
                    }
                }.bind({currentSocket: sockets[numberOfPlayers], playerIndex : Number(numberOfPlayers)}));
                sockets[numberOfPlayers].on('gridValues', function (msg){
                    const playerIndex = sockets.indexOf(this.currentSocket);
                    playerGrids[playerIndex] = msg;
                }.bind({currentSocket: sockets[numberOfPlayers], playerIndex : Number(numberOfPlayers)}));
                sockets[numberOfPlayers].on('disconnect', function (msg){
                    // console.log(msg, this.currentSocket.id, this.playerIndex);
                    cleanUpPlayerData(this.currentSocket)
                }.bind({currentSocket: sockets[numberOfPlayers], playerIndex : Number(numberOfPlayers)}));
                sockets[numberOfPlayers].emit('handshake1', 'ok'+numberOfPlayers);
                sockets[numberOfPlayers].emit('handshake2', strikerValues);
                numberOfPlayers += 1;
            }else if (numberOfPlayers > sockets.length){
                console.log('more no of players')
            }
            done();
        }, null, null);
        // if (sockets.length !== numberOfPlayers) {
        //     if (sockets.length > numberOfPlayers){
        //         // player joined
        //         console.log('added listener', sockets[sockets.length - 1].id, 'Player '+sockets.length);
        //         sockets[sockets.length - 1].on('played', function (msg){
        //             console.log(msg, this.currentSocket.id);
        //             // if (playerTurn === sockets.indexOf(this.currentSocket))
        //             broadcast(roomName, msg);
        //         }.bind({currentSocket: sockets[sockets.length - 1]}));
        //     }
        //     numberOfPlayers = numberOfPlayers + 1;
        // }
    }
    async function broadcast(roomName, event, msg){
        const sockets = gameRoomCollection[roomName].sockets;
        for (const s of sockets){
            s.emit(event, msg);
        }
    }
    function cleanUpPlayerData(currentSocket) {
        const playerIndex = sockets.indexOf(this.currentSocket);
        const index = sockets.indexOf(currentSocket);
        sockets.splice(index, 1);
        playerGrids.splice(index, 1);
        bingoScore.splice(index, 1);
        numberOfPlayers--;
        console.log('removed socket of player', playerIndex);
        console.log('no of players in room', numberOfPlayers);
    }
    function checkStatus() {
        playerGrids.forEach((grid) => {
            let score = 0;
            const index = playerGrids.indexOf(grid);
            // horizontal & vertical score
            for (let i of _.range(0, 5)){
                let horizontalStrike = true;
                for (let j of _.range(0, 5)){
                    let idx = i*5 + j;
                    horizontalStrike = strikerValues.includes(grid[idx]);
                    if (!horizontalStrike) {break}
                }
                if (horizontalStrike) {score++;}
                let verticalStrike = true;
                for (let j of _.range(0, 5)){
                    let idx = i + j*5;
                    verticalStrike = strikerValues.includes(grid[idx]);
                    if (!verticalStrike) {break}
                }
                if (verticalStrike) {score++;}
            }
            // diagonal score
            let diagonalStrike = true;
            for (let j of _.range(0, 5)){
                let idx = j*6;
                diagonalStrike = strikerValues.includes(grid[idx]);
                if (!diagonalStrike) {break}
            }
            if (diagonalStrike){score++}
            diagonalStrike = true;
            for (let j of _.range(1, 6)){
                let idx = j*4;
                diagonalStrike = strikerValues.includes(grid[idx]);
                if (!diagonalStrike) {break}
            }
            if (diagonalStrike){score++}
            bingoScore[index] = score;
            if (score >= 5){
                console.log('position',nextWinPosition, 'player', index+1);
                broadcast(roomName, 'win', {position: nextWinPosition, player: index+1});
                nextWinPosition++;
                sockets[index].emit('youwon', 'Yay, You Won');
                if (nextWinPosition > numberOfPlayers){
                    console.log('GameOver');
                    broadcast(roomName, 'gameover', 'Game Over')
                }
            }
        });
        console.log(bingoScore)
    }
}

module.exports = function (io_ref) {
    io = io_ref;
    return router;
};
