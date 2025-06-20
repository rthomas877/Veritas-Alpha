import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginActual() {

    const [query, setQuery] = useState('');
    // const [inputValue, setInputValue] = useState('');

    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (query !== "") {
                navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=3mo`);
                setQuery("");
            }
        }
      };
    
      const handleSearch = (e) => {
        if (query !== "") {
            navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=3mo`);
            setQuery("");
        }
      };

      const handleSearchAcc = (e) => {
            navigate(`/createACC?`);
      };

    return (
        <div className="faqList">
            <h1 className="FAQTitle">Login</h1>
            <br></br>
            <input
                className="msbTextY"
                type="text"
                placeholder="Enter email" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                className="msbTextY"
                type="text"
                placeholder="Enter password" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                onClick={handleSearch}
                className="searchButtonY">
                Login
            </button>
            <h3 className='noAcc'>Don't have an account? Click the button below:</h3>
            <button
                onClick={handleSearchAcc}
                className="searchButtonYO">
                Create Account
            </button>
        </div>
    );
}

export default LoginActual;