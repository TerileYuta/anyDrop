import './App.css';
import React, { useState, useEffect} from 'react';
import { Routes, Route} from 'react-router-dom';

import Home from './components/templates/Home';
import Send from './components/templates/Send';
import Receive from './components/templates/Receive';
import Post from './components/templates/Post';
import Structure from './components/templates/Structure';
import Footer from './components/templates/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(()=>{
    if(darkMode){
      document.querySelector('html')?.classList.add('dark')
    }else{
      document.querySelector('html')?.classList.remove('dark')
    }
  }, [darkMode])
  
  const modeChange = (e) => {
    setDarkMode(e.target.checked);
  }

  return (
    <div className='h-screen'>
      <Routes>
          <Route index path='/' element={<Home/>} />
          <Route path='/send' element={<Send/>} />
          <Route exact path='/receive' element={<Receive/>} />
          <Route path="/receive/:key" element={<Receive/>} />
          <Route path="/structure/:title" element={<Structure/>} />
          <Route path="/document/:title" element={<Post  path="document"/>} />
      </Routes>
      <Footer modeChange={modeChange}/>
    </div>
  );
}

export default App;
