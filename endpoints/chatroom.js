const AsyncLock = require('async-lock');
let lock = new AsyncLock();
let lockUsers = new AsyncLock();
let activeUsers = {count: 0};
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
                console.log(e)

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
        console.log('chat room connection by a user', activeUsers.count+1);
        socket.on('chatroom', chatHandler);
        socket.on('disconnect', ()=>{
            console.log('chat disconnected', activeUsers.count-1);
            lockUsers.acquire('user', (done) => {
                activeUsers.count--;
                done()
            })
        });
        lockUsers.acquire('user', (done) => {
            activeUsers.count++;
            done()
        })
    });
    setInterval(broadcast, 500);
    return activeUsers;
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
                sockets[key].emit('details', {activeCount : activeUsers.count});
                // console.log('chatusers' , activeUsers.count)
            }catch (e) {
                console.log(e);
            }
        }
    });
}
