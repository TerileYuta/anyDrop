import React, {useState} from 'react'
import io from 'socket.io-client'

//WebSocket通信確立
const socket = io("http://localhost:5000");
const pc_config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
//認証キーを生成
const key = Math.floor(Math.random() * 99999999);
//WebRTCAPIのインスタンス化
const peer = new RTCPeerConnection(pc_config);  
var dataChannelList = [];
var dataList = [];
var dataListLength = 0;

var testList = [];


const reader = new FileReader();
var fileData;
var sendSize = 0;

const SPLIT_SIZE = 16 * 1024; //KB

const Send = () => {
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [sendParcentage, setSendParcentage] = useState(0);
    
    //サーバーへ認証情報を送信
    const handleSendKey = () => {
        if(fileData != null){
            socket.emit("owner_login", { key: key });
        }else{
            alert("ファイルを選択してください");
        }
    };

    const handleFile = (event) =>{
        const file = event.currentTarget.files[0];

        console.log(file);

        setFileName(file["name"]);
        setFileType(file["type"]);
        setFileSize(file["size"]);

        reader.onload = () => {
            fileData = reader.result  

            dataList = splitData(fileData);
            createChannel(file["size"]);
        };

        reader.readAsArrayBuffer(file);       
    };

    const createChannel = (size) => {
        for(var i = 0; i < dataList.length; i++){
            console.log(i);
            var datachannel = peer.createDataChannel(String(i));
            datachannel.binaryType = "arraybuffer";

            dataChannelList.push(datachannel);
            
            datachannel.onopen = async (event) =>{
                datachannel = event.currentTarget;
            
                console.log("DataChannel Open!!");
    
                var id = Number(datachannel.label);
                
                var splitData = dataList[id];

                console.log(`ID : ${id}`);

                splitData.forEach(async (data, index) => {
                    await datachannel.send(data);

                    testList.push(data);
    
                    sendSize += data.byteLength;


                    if(sendSize == size){
                        console.log("DONE!!");
                        await datachannel.send(JSON.stringify({message: "done"}));
                    }
                });
            };
        }

        console.log(dataChannelList);
    };


    const splitData = (arrayBuffer) => {
        var index = 0;
        var fileLength = fileData.byteLength;

        var list = [];

        while(index * SPLIT_SIZE < fileLength){
            list.push(arrayBuffer.slice(index * SPLIT_SIZE, (index + 1) * SPLIT_SIZE));

            index ++;
        }

        dataListLength = list.length;

        console.log(dataListLength);

        list = dataChannelSplit(list);

        return list;
    };

    const dataChannelSplit = (list) => {
        var newList = [];
        var index = 0;
        var splitNum = 1024;

        while(index * splitNum <= list.length){
            newList.push(list.slice(index * splitNum, (index + 1) * splitNum));

            index ++;
        }

        console.log(newList)

        return newList;
    };

    const create_offer = (async () => {
        peer.onicecandidate = ((event) => {
            socket.emit("client-candidate", {candidate: event.candidate});
        });

        peer.onconnectionstatechange = (event) => {
            console.log(`STATE : ${peer.connectionState}`);
        };

        const offer = await peer.createOffer();
        console.log(`OFFER : ${offer}`);
        await peer.setLocalDescription(offer);

        socket.emit("new-offer", {sdp: offer});
    });

    socket.on("success", (data) => {
        console.log(data.message);
    });

    //クライアントのログインを受信
    socket.on("new_client", (data) => {
        console.log(`${data.name}さんがログインしました.`);

        socket.emit("file-info", {type:fileType, fileName: fileName, fileSize: fileSize});

        create_offer();
    });

    socket.on("answer", async (data) => {
        console.log(peer.remoteDescription);
        console.log(peer.connectionState);
        if(peer.remoteDescription == null){
            await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
    });

    socket.on("owner-candidate", async (data) => {
        await peer.addIceCandidate(data.candidate);
    });

    return (
        <div>
            <input type="file" onChange={handleFile}/>
            <input type="number" placeholder="アクセスキー" readOnly value={key} />
            <button onClick={handleSendKey}>接続</button>

            <h1>{fileSize}</h1>

            <h1>{sendParcentage}%</h1>
        </div>
    )
}

export default Send