import React, {useState, useEffect} from 'react';

import {TextBold, Text} from '../Text/BaseText';

function LogCard(props) {
    const [Logs, setLogs] = useState(props.Logs);

    useEffect(() => {
        setLogs(props.Logs);
    }, [props.Logs]);

    return (
        [...Logs].reverse().map((log, key) => {
            return(
                <div className='w-11/12 p-2 m-1 mt-1 mx-auto rounded-lg bg-white' key={key}>
                    <TextBold addClass={log.error ? "text-red-500" : "text-black"} text={log.title}/>
                    <Text addClass="m-0" text={`${log.log}`}/>
                </div>
            )
        })

    )
}

export default LogCard