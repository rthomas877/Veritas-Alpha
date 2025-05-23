import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LightWeightSB() {

    const [query, setQuery] = useState('');
    // const [inputValue, setInputValue] = useState('');

    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (query !== "") {
                navigate(`/stock?q=${encodeURIComponent(query.trim())}`);
                setQuery("");
            }
        }
      };
    
      const handleSearch = (e) => {
        if (query !== "") {
            navigate(`/stock?q=${encodeURIComponent(query.trim())}`);
            setQuery("");
        }
      };

    return (
        <div className='lightSearchBox'>
          <input
            className="msbTextA"
            type="text"
            placeholder="Enter a ticker symbol (e.g., AAPL)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
              onClick={handleSearch}
              className="searchButtonA">
              Search
          </button>
        </div>
    );
}

export default LightWeightSB;