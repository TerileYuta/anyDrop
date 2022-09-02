import React from 'react'
import {Link} from 'react-router-dom';

import {SiMinutemailer} from 'react-icons/si';
import {MdOutlineAttachMoney, MdOutlineSecurity} from 'react-icons/md';
import {AiOutlineFile} from 'react-icons/ai';

import {H1, H3, P} from '../parts/Text/BaseText';

import HomeCard from '../parts/Card/HomeCard';
import HomeHeadLine from '../parts/Text/HomeHeadLine';

import Head from './Head';

const Home = () => {
    return (
        <div className='bg- white'>  
            <Head/>
            <div className='lg:px-64 px-8 py-16'>
                <div className='h-64'>
                    <H1 text={"anyDropは革新的な"}/>
                    <H1 text={"ファイル転送サービスです"}/>
                    <H3 text={"anyDropでファイルを高速に送信し"}/>
                    <H3 text={"時間を節約しましょう"}/>
                </div>
                <div className='w-1/2 flex'>
                    <div className='w-64 mx-3 py-1 font-bold text-center text-xl rounded-lg border-2 border-gray-200'>
                        <Link to="./send" >受け取る</Link>
                    </div>
                    <div className='w-64 py-1 text-white font-bold text-center text-xl rounded-lg bg-black'>
                        <Link to="./send" >送信する</Link>
                    </div>
                </div>
            </div>
            <hr />
            <HomeHeadLine sentence={"なぜanyDropを使うのか"}/>
            <div className='mx-auto lg:mx-48 my-5 flex flex-wrap'>
                <HomeCard
                    title={"高速転送"}
                    content={"anyDropはWebRTCを利用して２つのブラウザをP2Pで接続しているため、高速での転送が可能です。"}
                    img={<SiMinutemailer/>}
                />
                <HomeCard
                    title={"容量はもう気にしなくても大丈夫です"}
                    content={"anyDropは一度に最高１TBのファイルを一斉に送信することができます。"}
                    img={<AiOutlineFile/>}
                />
                <HomeCard
                    title={"高いセキュリティ性"}
                    content={"anyDropで通信される情報はすべて暗号化されているため、安心してご利用いただけます。"}
                    img={<MdOutlineSecurity/>}
                />
                <HomeCard
                    title={"完全無料"}
                    content={"anyDropは完全無料で全機能をご利用いただけます"}
                    img={<MdOutlineAttachMoney/>}
                />
            </div>
        </div>
    )
}

export default Home