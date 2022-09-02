import React from 'react'

function SendHeader(props) {
  return (
    <div className='w-32 h-full p-1 cursor-pointer hover:bg-gray-200'>
        {props.img}
    </div>
  )
}

export default SendHeader