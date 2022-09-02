import React, { useState } from 'react';
import io from 'socket.io-client';
import {Link, useParams} from 'react-router-dom';

import {H3, PLink} from '../parts/Text/BaseText';

import LogCard from '../parts/Card/LogCard';
import FileCard from '../parts/Card/FileCard';

import AppHead from './AppHead';
import ChatBox from './ChatBox';

import StatusButton from '../parts/Button/StatusButton';


import {GiSmartphone} from 'react-icons/gi';

import { WebRtc } from '../../library/WebRtc';

const socket = io("http://localhost:5000");
const WebRTC = new WebRtc(socket, "receive");

const Receive = () => {
    const [key, setKey] = useState(useParams().key);
    const [panel, setPanel] = useState("chat"); 
    const [name, setName] = useState("");
    const [fileList, setFileList] = useState({});
    const [status, setStatus] = useState("disconnect");
    const [messageList, setMessageList] = useState([]);
    const [parcent, setParcent] = useState(0);
    const [Log, setLog] = useState("");
    const [viewUrl,setviewUrl] = useState("");

    const addLog = (title, log, error) =>{
        setLog([...Log, {error: error || false, title: title, log: log}]);
    };

    const handleSendKey = () => {
        WebRTC.sendKey(key);
    };

    const sendMessage = (message, system) => {
        var data = {message: message, time: new Date(), from: true, system: system || false};
        socket.emit("chat", data);
        setMessageList([...messageList, data]);
    };

    const handleFileClick = (key) => {
        const blob = WebRTC.downloadFile(key, fileList[key]["info"].type);
        setviewUrl(URL.createObjectURL(blob));  
    };

    //--------------------------------------------------------------------------------
    socket.on("error", (data) => {
        console.log(data.message);
    });

    socket.on("new-offer", (data) => {
        WebRTC.setRemote(data.sdp);
    });

    socket.on("login", (data) => {
        setStatus("connect");
        addLog("ログインに成功しました", `「${data.name}」さんのルームにログインしました`);
    });

    socket.on("new-ice-candidate", async (data) => {
        WebRTC.addCanadidate(data.candidate);
    });

    socket.on("done", (data) => {
        var id = data.id;
        var fileInfo = data.info;

        if(data.message === "success"){
            const blob = WebRTC.downloadFile(id, fileInfo.type);
            var fileData = {info: fileInfo.info, done:true , blob: URL.createObjectURL(blob)};

            setFileList({...fileList, [id]: fileData});

            WebRTC.reset();
        }
    });

    socket.on("chat", (data) => {
        data.from = false;
        setMessageList([...messageList, data]);

        console.log(fileList);
    });

    return (
        <div>
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
                                <FileCard receive={true} fileList={fileList} handleClick={handleFileClick}/>
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
        </div>
    );
};

export default Receive;