import './App.css';
import React from 'react'; // allows for updating
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import FAQs from './components/FAQs';
import StockScreen from './components/StockScreen';
import Learn from './components/Learn';
import Watchlist from './components/Watchlist';
import Login from './components/Login';
import Account from './components/Account';
import CreateACC from './components/CreateACC';


function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQs />} />
        <Route path="/stock" element={<StockScreen />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/createACC" element={<CreateACC />} />
      </Routes>
    </Router>
  );
}

export default App; 