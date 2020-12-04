//モジュールを読み込む
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//appを生成する
const app = express();
app.use(multer().none()); 

// ルートにアクセス
app.get('/', (req, res) => 
    res.sendFile(__dirname + '/web/index.html')
);

//ルームへのアクセス
app.get('/rooms/1' , (req, res) => {
    //chatroomのhtmlとcontentの取得
    res.sendFile(__dirname + '/web/chatRoom.html') && res.json(chatRoomContent);
});




//chatの内容
const chatRoomContent = [];
const chatRoomUsers = [];

//chatの内容の取得
app.get('/api/v1/list', (req, res) => {

    res.json(chatRoomContent) && res.json(chatRoomUsers);
});

//chatでの投稿
app.post('/api/v1/add', (req, res) => {
    const chatData = req.body;
    const chatContent = chatData.content;
    const userName = req.userName;

    //chatの投稿
    const chatContentID = uuidv4();
    //ユーザの登録
    const userID = uuidv4();

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
app.delete('/api/v1/item/:id', (req, res) => {
    const index = chatRoomUsers.findIndex((item) => item.id == req.params.id);

    if(index >= 0) {
        const deleted = chatRoomUsers.splice(index, 1);
        console.log('Delete: ' + JSON.stringify(deleted[0]));
    }

    res.sendStatus(200);
})

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('ChatApp listening on port 3000'));