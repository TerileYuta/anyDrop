const { Socket } = require("dgram");
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const {Server} = require("socket.io");
const io = new Server(server, {
    cors:{
        origi: ["http://localhost:3000"]
    }
});

const PORT = 5000;

var owner_list = {};

//クライアントと通信
io.on("connection", (socket) => {
    var id = socket.id;
    var room = "";
    var peer_id = "";

    socket.on("owner-login", (data) => {
        room = String(data.key);
        peer_id = id;

        owner_list[room] = {owner : id, client: null};

        socket.join(room);
        socket.to(room).emit("login", {title: "ルームを作成しました", log: `${room}を認証しました`});
    });

    socket.on("client-login", async (data) => {
        room = String(data.key);
        var name = data.name || "No Name";
        socket.join(room);

        peer_id = owner_list[room].owner;

        socket.to(peer_id).emit("new-client", {key: room, name:name});
    });

    socket.on("client-pass", (data) => {
        socket.broadcast.to(room).emit("login", data);
    });

    socket.on("new-offer", (data) => {
        console.log(room);
        socket.broadcast.to(room).emit("new-offer", data);    
    });

    socket.on("answer", (data) => {   
        socket.to(peer_id).emit("answer", data);  
    });
    
    socket.on("client-candidate", (data) => {
        socket.broadcast.to(room).emit("client-candidate", data);
    });
    
    socket.on("owner-candidate", (data) => {
        socket.to(peer_id).emit("owner-candidate", data);
    });
    
    socket.on("file-success", async(data) => {
        console.log("File Success !!!");    
        var result = await socket.to(room).emit("file-success", data);
        console.log(result);
    });

    socket.on("done", (data) => {
        console.log(data);
        socket.broadcast.to(room).emit("done", data);
    });

    socket.on("chat", (data) => {
        socket.broadcast.to(room).emit("chat", data);
    });
});

server.listen(PORT, () => console.log("server is running on 5000"));