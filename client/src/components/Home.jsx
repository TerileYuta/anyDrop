import React from 'react'
import {Link} from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>This is Home</h1>

            <Link to="./send">Send</Link>
            <Link to="./receive">Receive</Link>
        </div>
    )
}

export default Home