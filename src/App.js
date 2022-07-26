import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './components/Home';
import Send from './components/Send';
import Receive from './components/Receive';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Home/>} />
        <Route path='/send' element={<Send/>} />
        <Route path='/receive' element={<Receive/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
