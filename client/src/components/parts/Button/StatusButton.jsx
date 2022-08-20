import React from 'react'


import ConnectBtn from './ConnectBtn';
import ConnectingBtn from './ConnectingBtn';
import DisConnectBtn from './DisConnectBtn';

function StatusButton(props) {
  return (
    <>
    {(() => {
        if(props.status === "connect"){

            return (<ConnectBtn status={props.status}/>)
        }else if(props.status === "connecting"){
            return (<ConnectingBtn status={props.status}/>)
        }else{
            return (<DisConnectBtn func={props.func}/>)
        }
    })()}
    </>           
  )
}

export default StatusButton