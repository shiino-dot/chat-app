//モジュールを読み込む
const app = require('express')();
const server = require('http').createServer(app);
const socketIo = require("socket.io");
const io = socketIo.listen(server);

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


app.use(multer().none()); 

//socket.ioの接続
io.on('connection',(socket) => {
    console.log('chatRoom connected');

    socket.on('message',(msg) => {
        io.emit('message-post', msg);
    });
});

app.get("/", (req, res) => {    
    res.sendFile(__dirname + "/web/index.html");
});


//ルームの追加
app.get('/rooms/index', (req, res) => {

    //chatRoom一覧
    const chatRoomIndex = [
        {Id: 1, title:'room1', discription:'雑談用' },
        {Id: 2, title:'room2', discription:'ミーティング' },
    ];

    res.json(chatRoomIndex);
});

app.post('/rooms/add', (req, res) => {
    const chatRoomData = req.body;
    const chatRoomTitle = chatRoomData.title;
    const chatRoomDiscription = chatRoomData.discription;

    const chatRoomItem = {
        Id,
        title: chatRoomTitle,
        discription: chatRoomDiscription
    };

    chatRoomIndex.push(chatRoomItem);

    console.log('add: ' + JSON.stringify(chatRoomItem));

    res.json(chatRoomItem);
});


//Idが数字であれば
// let Id = /^[0-9]+$/;

//roomへのアクセス
app.get(`/rooms/1`　, (req, res) => {
    res.sendFile(__dirname + '/web/chatRoom.html');
});


//chatの内容
const chatRoomContent = [];
const chatRoomUsers = [];

//ユーザの登録
const userID = uuidv4();


//chatの内容の取得
app.get(`/rooms/1/info`, (req, res) => {

    res.json(chatRoomContent) && res.json(chatRoomUsers);
});

//chatでの投稿
app.post(`/rooms/1/add`, (req, res) => {
    const chatData = req.body;
    const chatContent = chatData.content;
    const userName = req.userName;

    //chatの投稿
    const chatContentID = uuidv4();

    //ユーザ情報
    const userInfo = {
        userID,
        userName: userName
    };


    //投稿情報
    const chatItem = {
        chatContentID,
        userID,
        content: chatContent
    };


    chatRoomContent.push(chatItem);
    chatRoomUsers.push(userInfo);

    console.log('add:' + JSON.stringify(chatItem));

    res.json(chatItem) && res.json(userInfo);
});

//userの削除
app.delete(`/rooms/1/add`, (req, res) => {
    const index = chatRoomUsers.findIndex((item) => item.id == req.params.id);

    if(index >= 0) {
        const deleted = chatRoomUsers.splice(index, 1);
        console.log('Delete: ' + JSON.stringify(deleted[0]));
    }

    res.sendStatus(200);
});

// ポート3000でサーバを立てる
server.listen(3000, () => console.log('ChatApp listening on port 3000'));