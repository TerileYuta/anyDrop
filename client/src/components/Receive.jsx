import React, { useState } from 'react'
import io from "socket.io-client"

const socket = io("http://localhost:5000");
const pc_config = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
const peer = new RTCPeerConnection(pc_config);

var dataList = [];
var receiveSize = 0;

const Receive = () => {
    const [key, setKey] = useState("");
    const [name, setName] = useState("");
    const [fileName, setFileName] = useState("test.png");
    const [fileType, setFileType] = useState("image/png");
    const [fileSize, setFileSize] = useState("image/png");
    const [parcent, setParcent] = useState(0);
    const [dataUrl, setDataUrl] = useState("");

    peer.ondatachannel = (event) => {
        const datachannel = event.channel;

        datachannel.onmessage = (event) => {
            var data = event.data;

            if(typeof(data) == "string"){
                data = JSON.parse(data);

                if(data.message == "done"){
                    console.log("DONE!!");
                    console.log(`Name : ${fileName}`);
                    console.log(`Type : ${fileType}`);

                    console.log(dataList);
    
                    var arrayBuffer = dataJoin(dataList);
                    downloadFile(arrayBuffer);
                }

            }else{
                receiveSize += data.byteLength;
                setParcent(Math.round((receiveSize / fileSize) * 100));

                console.log(data);

                var id = event.currentTarget.label;

                if(dataList[id] != null){
                    dataList[id].push(data);
                }else{
                    dataList[id] = [];
                    dataList[id].push(data);
                }

            }
        };

        datachannel.onopen = (event) => {
            console.log("DATA OPEN");
        };
    };

    peer.onconnectionstatechange = (event) => {
        console.log(peer.connectionState);
    };

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("owner-candidate", { candidate: event.candidate });
        }
    };

    const handleSendKey = () => {
        socket.emit("client_login", { key: key, name: name });
    };

    const createAnswer = (async () => {
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", { sdp: answer });
    });

    const dataJoin = (dataList) => {
        var sumLength = 0;

        var allDataList = [];
        Object.keys(dataList).forEach((id) => {
            dataList[id].forEach(data => {allDataList.push(data)})
        });


        allDataList.forEach((data) => {
            sumLength += data.byteLength;
        });

        var whole = new Uint8Array(sumLength);
        var pos = 0;

        allDataList.forEach((data) => {
            whole.set(new Uint8Array(data), pos);
            pos += data.byteLength;
        });

        return whole.buffer;
    };

    const downloadFile = (arrayBuffer) => {
        const blob = new Blob([arrayBuffer], {type: fileType});
        setDataUrl(URL.createObjectURL(blob));                
    };

    socket.on("error", (data) => {
        console.log(data.message);
    });

    socket.on("login", (data) => {
        console.log(`${data.key}の認証が通りました。`);
    });

    socket.on("new-offer", (data) => {
        if (peer.remoteDescription == null) {
            peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
            createAnswer();
        }
    });

    socket.on("new-ice-candidate", async (data) => {
        await peer.addIceCandidate(data.candidate);
    });

    socket.on("file-info", (data) => {
        setFileName(data.fileName);
        setFileType(data.type);
        setFileSize(data.fileSize);
    });

    return (
        <div>
            <input type="number" placeholder="アクセスキー" onChange={(e) => setKey(e.target.value)} value={key} />
            <input type="text" placeholder="名前" onChange={(e) => setName(e.target.value)} value={name} />
            <button onClick={handleSendKey}>接続</button>

            <a href={dataUrl} download={fileName}>ダウンロード</a>
            <h1>{parcent}%</h1>
        </div>
    );
};

export default Receive;