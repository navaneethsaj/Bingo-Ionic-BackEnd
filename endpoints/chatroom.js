const AsyncLock = require('async-lock');
let lock = new AsyncLock();
let chats = [{username: 'Admin', msg: 'Welcome to ChatRoom', time: new Date()},
{username: 'Admin', time: new Date(), msg: 'You can chat with fellow players and challenge them here'},
];
let io;
function chatHandler(msg){
    try{
        lock.acquire('lock', (done) => {
            try{
                if (msg.msg.length > 0 && msg.username.length > 0){
                    msg.time = new Date();
                    chats.push(msg);
                    if (chats.length > 100){
                        chats.splice(0, 1);
                    }
                }
            }catch (e) {

            }
            done()
        })
    }catch (e) {
        console.log(e)
    }
}

module.exports = function (io_ref) {
    io = io_ref;
    io.of('/chatroom').on('connection', (socket) => {
        console.log('chat room connection by a user');
        socket.on('chatroom', chatHandler)
    });
    setInterval(broadcast, 500);
};
function broadcast(){
    let sockets;
    let clonedchats = [];
    lock.acquire('lock', (done) => {
        try{
            clonedchats = [...chats];
        }catch (e) {

        }
        done();
        sockets = io.of('/chatroom').clients().connected || {};
        for (let key in sockets){
            try{
                sockets[key].emit('chatroom', {list:  clonedchats});
            }catch (e) {
                console.log(e)
            }
            try{
                sockets[key].emit('details', {activeCount : Object.keys(sockets).length});
            }catch (e) {
                console.log(e);
            }
        }
    });
}
