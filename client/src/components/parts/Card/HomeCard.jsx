import React from 'react';
import { IconContext } from "react-icons";

import {H3, P} from '../Text/BaseText';

function HomeCard(props) {
  return (
    <div  className='w-full lg:flex-1 border border-gray-300 rounded p-3 mx-5 my-5'>
        <IconContext.Provider value={{ color: "black", className: "h-16 lg:h-24 w-full my-5" }}>
          <div>
            {props.img}
          </div>
        </IconContext.Provider>
        <H3 text={props.title}/>
        <P text={props.content}/>
    </div>
  )
}

export default HomeCard