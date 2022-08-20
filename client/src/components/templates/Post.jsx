import React, { useState, useEffect } from 'react';
import ReactMarkDown from 'react-markdown';


const Post = (props) => {
  const [posts, setPost] = useState("");

  useEffect(() => {
    import(`../../markdown/${props.path}/${props.title}.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setPost(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },);

  return (
    <>
      <ReactMarkDown className='prose mx-auto min-h-screen'>{posts}</ReactMarkDown>
    </>
  )
}

export default Post