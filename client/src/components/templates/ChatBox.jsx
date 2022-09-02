import React, {useState, useEffect} from 'react';
import {v4 as uuid} from 'uuid';

import {MessageMe, MessageYou} from '../parts/Item/ChatMessage';

import {AiOutlineSend} from 'react-icons/ai';


function ChatBox(props) {
  const [messageList, setMessageList] = useState(props.messageList);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessageList(props.messageList);
  }, [props.messageList]);

  const handleSend = () => {
    props.sendMessage(message);
    setMessage("");
  };

  const updateMessageBox = (e) => {
    setMessage(e.target.value);
  }

  return (
    <div className="w-full h-main">
      <div className='h-90p overflow-y-scroll'>
        {
          messageList.map((message) => {
            var key = uuid();
            return(
              message.from?
                <MessageMe key={key} time={message.time} system={message.system} message={message.message}/>
                :
                <MessageYou key={key} time={message.time} system={message.system} message={message.message}/>
              
            )
          })
        }
      </div>
      <div className='h-10p flex'>
          <input className="shadow h-10 mx-2 my-auto appearance-none border rounded-full w-10/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300" type="text" placeholder="メッセージを入力" value={message} onChange={updateMessageBox}/>
          <button className="bg-blue-500 my-auto mx-2 hover:bg-blue-700 text-white font-bold h-10 w-1/6 rounded focus:outline-none focus:shadow-outline flex" type="button" onClick={handleSend}>
            <p className='my-auto flex-1 text-right'>送信</p>
            <AiOutlineSend className='my-auto h-6 flex-1'/>
          </button>
      </div>
    </div>
  )
}

export default ChatBox