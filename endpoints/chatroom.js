let chats = [{username: 'Admin', msg: 'Welcome to ChatRoom', time: new Date()},{username: 'Admin', time: new Date(), msg: 'You can chat with fellow players and challenge them here'},]
let io;
function chatHandler(msg){
    try{
        if (msg.msg.length > 0 && msg.username.length > 0){
            msg.time = new Date();
            chats.push(msg)
        }
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
    sockets = io.of('/chatroom').clients().connected || {};
    for (let key in sockets){
        sockets[key].emit('chatroom', {list:  chats});
    }
}
