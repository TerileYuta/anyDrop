import React from 'react';
import FooterLink from '../parts/Text/FooterLink';

import {H1, H3} from '../parts/Text/BaseText';

function Footer(props) {
  return (
    <footer className='bg-black h-64 w-full border-t border-white text-white p-12 flex'>
      <div className='flex-1'>
        <H1 text={<FooterLink to="./" title="anyDrop"/>}/>
        <div className='mt-5 ml-5'>
          <H3 text={<FooterLink to="./" title="Home" />}/>
          <H3 text={<FooterLink to="./send" title="Send" />}/>
          <H3 text={<FooterLink to="./receive" title="Receive" />}/>
        </div>
      </div>
      <input type="checkbox" onChange={props.modeChange}/>
    </footer>
  )
}

export default Footer