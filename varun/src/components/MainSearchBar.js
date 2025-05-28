import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function MainSearchBar() {

    const [query, setQuery] = useState('');

    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          if (query !== "") {
            navigate(`/stock?q=${encodeURIComponent(query)}&t=3mo`);
          }
        }
      };
    
      const handleSearch = (e) => {
        if (query !== "") {
          navigate(`/stock?q=${encodeURIComponent(query)}&t=3mo`);
        }
      };

    return (
        <div className="mainSearchBar">
        <h1 className="msbHeader">Financial data at your fingertips</h1>
        <h1 className="msbText1">Track thousands of companies all in one place</h1>
        <div>
          <input
            className="msbText"
            type="text"
            placeholder="Enter a ticker symbol (e.g., AAPL)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
              onClick={handleSearch}
              className="searchButton">
              Search
          </button>
        </div>
      </div>
    );
}

export default MainSearchBar;