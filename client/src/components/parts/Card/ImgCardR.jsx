import React from 'react'
import {Link} from 'react-router-dom';

import {H3, P, PLink} from '../Text/BaseText';

function ImgCardR(props) {
  return (
    <div className='mx-auto py-12 w-5/6 lg:w-3/4'>
        <div className='flex flex-wrap'>
          <div className='w-1/3'>
            <H3 text={props.title}/>
            <P text={props.content}/>
            <PLink text={<Link to={props.url}>→詳細情報</Link>}/>
          </div>
          <div className='w-2/3'>
            <img className='rounded-lg w-1/2 mx-auto' src={props.img} alt="" />
          </div>
        </div>
    </div>
  )
}

export default ImgCardR