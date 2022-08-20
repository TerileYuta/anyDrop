import React, { useState } from 'react';
import {v4 as uuid} from 'uuid';
import io from 'socket.io-client';
import {Link} from 'react-router-dom';

import {H3, PLink} from '../parts/Text/BaseText';

import LogCard from '../parts/Card/LogCard';
import FileCard from '../parts/Card/FileCard';

import AppHead from './AppHead';
import ChatBox from './ChatBox';

import StatusButton from '../parts/Button/StatusButton';


import {GiSmartphone} from 'react-icons/gi';

import { WebRtc } from '../../library/WebRtc';


//WebSocket通信確立
const socket = io("http://localhost:5000");

//認証キーを生成
const key = Math.floor(Math.random() * 99999999);

const WebRTC = new WebRtc(socket, "send");

var processingId = "";
var processiingFile = null;

const Send = () => {
    const [panel, setPanel] = useState("chat"); 
    const [viewUrl, setviewUrl] = useState("");
    const [status, setStatus] = useState("disconnect");
    const [name, setName] = useState("I am");
    const [fileList, setFileList] = useState({});
    const [sendParcentage] = useState(0);
    const [messageList, setMessageList] = useState([]);
    const [Log, setLog] = useState([{error: false, title: "認証キーが発行されました", log: `認証キー : ${key}が付与されました`}]);

    const addLog = (title, log, error) =>{
        setLog([...Log, {error: error || false, title: title, log: log}]);
    };

    const sendMessage = (message, system) => {
        var data = {message: message, time: new Date(), from: true, system: system || false};

        socket.emit("chat", data);
        setMessageList([...messageList, data]);
    };

    const sendFile = (Id) => {
        if(status === "connect"){
            processingId = Id;
            processiingFile = fileList[processingId]
            if (Object.keys(fileList).length >= 1) {
                WebRTC.createOffer(Id);
                sendMessage("ファイルを送信しました", true);
            } else {
                addLog("ファイルを選択してください", "", true);
            }
        }else{
            addLog("接続されていません", "", true);
        }
    }

    //サーバーへ認証情報を送信
    const handleSendKey = async () => {
        if(WebRTC.sendKey(key)){
            setStatus("connecting");
            addLog("認証キーをサーバーに送信しました", key);
        }
    }

    const handleFile = async (event) => {
        var Id = uuid();
        var fileInfo = await WebRTC.handleFile(event, Id);

        if(fileInfo){
            addLog("ファイルが選択されました", `${fileInfo["name"]}`);

            setFileList({...fileList, [Id] : {info: fileInfo, done: false}});
        }else{
            addLog("ファイルの読み込みに失敗しました","",true);
        }
    };

    const handleFileClick = (key) => {
        const blob = WebRTC.downloadFile(key, fileList[key]["info"].type);
        setviewUrl(URL.createObjectURL(blob));  
    };

    //クライアントのログインを受信
    socket.on("new-client", (data) => {
        addLog('クライアントがログインしました', `「${data.name}」さんがログインしました。`);
        setStatus("connect");
        
        socket.emit("client-pass", {name: name});
    });

    socket.on("login", (data) => {
        setStatus("connect")
        addLog(data.title, data.log);
    });

    socket.on("answer", async (data) => {
        WebRTC.setRemote(data.sdp);
    });

    socket.on("owner-candidate", (data) => {
        WebRTC.addCanadidate(data.candidate);
    });

    socket.on("file-success", (data) => {
        if(processingId != null){
            socket.emit("done", {message: "success", id: processingId, info: processiingFile});
            processiingFile["done"] = true;
            setFileList({...fileList, [processingId]:{info: processiingFile.info, done: processiingFile.done}});
            processingId = null;
            processiingFile = null;

            WebRTC.reset();
        }
    });

    socket.on("chat", (data) => {
        data.from = false
        setMessageList([...messageList, data]);
    });

    return (
        <div className='m-0border h-screen rounded-lg bg-slate-50 overflow-hiden'>
            <AppHead path={"Send"}/>
            <div className='flex p-3 h-app'>
                <div className='w-1/5'>
                    <div className='h-32 flex'>
                        <div className='flex-1'>
                            <GiSmartphone className='w-full h-full m-1'/>
                        </div>
                        <div className='flex-1'>
                            <PLink text={<Link to={`/receive/${key}`} target="_blank">{key}</Link>}/>           
                            <StatusButton status={status} func={handleSendKey}/>
                        </div>  
                    </div>
                    <div className='border-r h-20'>
                        <LogCard Logs={Log}/>
                    </div>
                </div>
                <div className='w-4/5'>
                    <div className='h-full rounded-lg bg-white flex'>
                        <div className='w-1/4 bg-slate-100 rounded-lg'>
                            <div className='h-32 m-3 border-2 border-gray-500 border-dashed'>
                                <input type="file" className='opacity-0 h-full w-hull' onChange={handleFile} />
                            </div>
                            <FileCard receive={false} fileList={fileList} sendFile={sendFile} handleClick={handleFileClick}/>
                        </div>
                        <div className='w-3/4'>
                            <div className='flex h-12 bg-slate-100'>
                                <div className='w-32 bg-white mt-1 text-center cursor-pointer' onClick={() => setPanel("chat")}>
                                    <H3 text="メッセージ"/>
                                </div>
                                <div className='w-32 bg-slate-100 ml-2 mt-1 text-center cursor-pointer' onClick={() => setPanel("view")}>
                                    <H3 text="ビュー"/>
                                </div>
                            </div>
                            {
                                //<iframe src={viewUrl} className="w-full h-full pb-24" frameborder="0"></iframe>
                            }

                            <ChatBox messageList={messageList} sendMessage={sendMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Send