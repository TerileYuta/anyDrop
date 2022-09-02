import React from 'react';
import {Link} from 'react-router-dom';

function FooterLink(props) {
  return (
    <Link className='text-lg mt-4 h-6 w-24 text-center font-bold' to={props.to}>{props.title}</Link>
  )
}

export default FooterLink