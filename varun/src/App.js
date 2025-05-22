import './App.css';
import React from 'react'; // allows for updating
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import FAQs from './components/FAQs';


function App() {    
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQs />} />
      </Routes>
    </Router>
  );
}

export default App; 