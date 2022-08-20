import React from 'react';
import {Link} from 'react-router-dom';
 
import HeaderLink from '../parts/Text/HeaderLink';


function Head(props) {
  return (
    <header className='py-4'>
      <div className='h-16 mx-16 flex px-5 mt-0 rounded-full border-2 border-gray-200'>        
        <h1 className='text-2xl font-bold mt-3 ml-5'><Link to={"/"}>anyDrop</Link></h1>
        <ul className='flex ml-3'>
          <HeaderLink to={"/send"} title={"Send"}/>
          <HeaderLink to={"/receive"} title={"Receive"}/>
          <HeaderLink to={"/structure"} title={"Structure"}/>
          <HeaderLink to={"/document"} title={"Document"}/>
        </ul>
      </div>
    </header>
  )
}

export default Head