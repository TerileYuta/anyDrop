import React from 'react';

import {H2} from "../parts/Text/BaseText";

import {Link} from "react-router-dom";

function AppHead(props) {
  return (
    <header className='flex h-12'>
        <H2 text={<Link to="/">anyDrop</Link>} addClass="ml-3"/>
    </header>
  )
}

export default AppHead