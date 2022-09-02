import React, {useState, useEffect} from 'react';
import {AiFillFile, AiOutlineDownload} from 'react-icons/ai';
import {GrSend} from 'react-icons/gr';


import {TextBold, Text, P} from '../Text/BaseText';


function FileCard(props) {
    const [fileList, setFileList] = useState(props.fileList);

    useEffect(() => {
        setFileList(props.fileList);
    }, [props.fileList]);

    const handleClick = (key) => {
        props.handleClick(key);
    }

    return (
        Object.keys(fileList).reverse().map((key) => {
            return(
                <div className='w-11/12 p-2 m-1 mt-3 mx-auto rounded-lg bg-white cursor-pointer' key={key} onClick={() => handleClick(key)}>
                    <div className='flex'>                  
                        <AiFillFile className="w-1/5 h-full m-2"/>
                        <div>
                            <TextBold className="m-0" text={fileList[key]["info"].name}/>
                            <Text className="m-0" text={fileList[key]["info"].type}/>
                            <Text className="m-0" text={`${Math.round(fileList[key]["info"].size / 1024)}KB`}/>
                        </div>
                    </div>
                    <div className='flex justify-end'>  
                        {props.receive?
                            <a className="bg-gray-300 m-1  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" href={fileList[key]["blob"]} download={fileList[key]["info"].name}>
                                <AiOutlineDownload className='mx-1'/>
                                <span>ダウンロード</span>
                            </a>
                            :
                            fileList[key]["done"]?
                            ""
                            :
                            <button className="bg-gray-300 m-1  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => props.sendFile(key)}>
                                <GrSend className='mx-1'/>
                                <span>ファイル送信</span>
                            </button>
                        }                 
                    </div>
                </div>
            )
        })

    )
}

export default FileCard