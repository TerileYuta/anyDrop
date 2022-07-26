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
    var my_owner = "";

    socket.on("owner_login", (data) => {
        room = String(data.key);
        my_owner = id;

        owner_list[room] = id;

        socket.join(room);
        socket.to(room).emit("success", {message: "Created room!"});
    });

    socket.on("client_login", async (data) => {
        room = String(data.key);
        var name = data.name;

        console.log(id);

        my_owner = owner_list[room];

        if(my_owner != null){
            socket.join(room);

            socket.broadcast.to(room).emit("login", {key: room});
            socket.to(my_owner).emit("new_client", {name: name});

        }else{
            socket.to(id).emit("error", {message: "オーナーが見つかりませんでした。"});
        }
        
    });

    socket.on("new-offer", (data) => {
        console.log(room);
        socket.broadcast.to(room).emit("new-offer", data);    
    });

    socket.on("answer", (data) => {   
        socket.to(my_owner).emit("answer", data);  
    });
    
    socket.on("client-candidate", (data) => {
        socket.broadcast.to(room).emit("client-candidate", data);
    });
    
    socket.on("owner-candidate", (data) => {
        socket.to(my_owner).emit("owner-candidate", data);
    });
    
    socket.on("file-info", (data) => {
        console.log(data);
        socket.broadcast.to(room).emit("file-info", data);
    });

    /*
    socket.on("disconnection", (socket) => {
        
    });
    */
});

server.listen(PORT, () => console.log("server is running on 5000"));