import React from 'react'

export const MessageMe = (props) => {
  return (
    <div className='justify-end flex' key={props.key}>
        <div className={`bg-teal-200 px-5 py-2 mt-3 mx-5 ${props.system? "rounded-lg":"rounded-full"}`}>
          <p>{props.message}</p>
        </div>
    </div>
  )
}

export const MessageYou = (props) => {
  return (
    <div className='justify-start flex' key={props.key}>
        <div className={`bg-gray-200 px-5 py-2 mt-3 mx-5 ${props.system? "rounded-lg":"rounded-full"}`}>
          <p>{props.message}</p>
        </div>
    </div>
  )
}
