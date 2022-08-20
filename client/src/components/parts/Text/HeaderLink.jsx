import React from 'react'
import {Link} from 'react-router-dom';

function HeaderLink(props) {
  return (
    <li className='text-lg mt-4 h-6 w-24 text-center font-bold'><Link to={props.to}>{props.title}</Link></li>
  )
}

export default HeaderLink