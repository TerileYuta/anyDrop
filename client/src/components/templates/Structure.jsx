import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';

import Head from './Head';
import Post from '../templates/Post';

import DocumentMenu from '../parts/Item/DocumentMenu';


function Structure() {
  const [pageTitle, setPageTitle] = useState(useParams().title);

  const changePage = (title) => {
    console.log(title);
    setPageTitle(title);
  };

  return (
    <>
        {pageTitle}
        <Head/>
        <div className='flex min-h-screen'>
            <div className='w-1/6 border-r '>
                <DocumentMenu title={"WebRTCについて"} link={"webrtc"} func={changePage}/>
                <DocumentMenu title={"ファイルサイズ"} link={"size"}  func={changePage}/>
            </div>
            <div className='w-5/6'>
                <Post path="structure" title={pageTitle}/>
            </div>
        </div>
    </>
  )
}

export default Structure