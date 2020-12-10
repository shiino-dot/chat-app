const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

app.use(multer().none()); 

//ルートの設定
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/web/index.html");
});

app.get('/room/:id', (req, res) => {
    res.sendFile(__dirname + "/web/chatroom.html");
});

//部屋情報
app.get('/rooms/index', (req, res) => {

    //chatRoom一覧
    const chatRoomIndex = [
        {Id: 1, title:'room1', discription:'雑談用' },
        {Id: 2, title:'room2', discription:'ミーティング' },
    ];

    res.json(chatRoomIndex);
});


let messages = {};
let counter = 0;

//roomへの入室
io.on('connection', (socket) => {
    console.log('chatroom conection');

    io.emit('change', {
        count: counter+1
    });

    socket.on('join', () => {
        counter ++;
        socket.emit('change', {
            count: counter
        });
    });

    socket.on('fetch message', (room_id) => {
        io.emit('chat message init', messages[room_id]);
    })
    

    socket.on('chat-message', (data) => {
        messages[data.room_id] = messages[data.room_id] || [];
        let log = {
            name: data.name,
            message: data.text
        };
        messages[data.room_id].push(log);
        io.emit('message', data);
    });

    socket.on('disconnect', (socket) => {
        console.log('chatroom disconnect');
        counter --;
        io.emit('change', {
            count: counter
        });
    });
});





// ポート3000でサーバを立てる
server.listen(3000, () => console.log('ChatApp listening on port 3000'));
