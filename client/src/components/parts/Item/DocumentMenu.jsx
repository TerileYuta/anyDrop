import React from 'react';
import {Link} from 'react-router-dom';


function DocumentMenu(props) {
  return (
    <div className='m-3 hover:bg-slate-100 p-2' onClick={props.func(props.link)}>
      <Link to={`/structure/${props.link}`} className="text-xl text-blue-400 ">{props.title}</Link>
    </div>
  )
}

export default DocumentMenu