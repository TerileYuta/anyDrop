import React from 'react'

function DisConnectBtn(props) {
  return (
    <div className='bg-red-500 mt-2 px-3 w-11/2 border rounded-full cursor-pointer' onClick={props.func}>
        <p className='text-center'>未接続</p>
    </div>
  )
}

export default DisConnectBtn