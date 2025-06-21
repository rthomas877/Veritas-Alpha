import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

function LoginActual() {

    const [query, setQuery] = useState('');
    const [queryEmail, setQueryEmail] = useState('');
    const [queryPassword, setQueryPassword] = useState('');
    const [response, setResponse] = useState('');
    const [userEmail, setUserEmail] = useState(null);
    const [query1, setQuery1] = useState('');
    const [query2, setQuery2] = useState('');
    const [userName, setUserName] = useState('');
    const [userFirstName, setUserFirstName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserEmail(decoded.sub || decoded.email); // sub = subject = email in your JWT
                setUserName(decoded.name);
                setUserFirstName(userName.split(' ')[0])
                console.log('Decoded token:', decoded);
            } catch (err) {
                console.error('Invalid token', err);
                localStorage.removeItem('token'); // optional: cleanup
            }
        }
    }, []);

    // const [inputValue, setInputValue] = useState('');

    const navigate = useNavigate();

    const handleSearch = (e) => {
        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: queryEmail,
              password: queryPassword,
            }),
        })
        .then(response => {
            if (!response.ok) {
            // If HTTP status not OK, throw error to catch
            return response.json().then(errData => {
                throw new Error(errData.message || 'Login failed');
            });
            }
            return response.json();
        })
        .then(data => {
            console.log('Login success:', data);
            setResponse(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                try {
                    const decoded = jwtDecode(data.token);
                    setUserEmail(decoded.sub || decoded.email);
                    setUserName(decoded.name);
                    setUserFirstName(userName.split(' ')[0])
                    navigate(`/`);
                  } catch (err) {
                    console.error('Error decoding token after login:', err);
                  }                
            }
            
        })
        .catch(error => {
              console.error('Login error:', error);
              setResponse({ error: error.message });
        });     
    }


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
            value={queryEmail}
            onChange={e => setQueryEmail(e.target.value)} 
            />
            <input
            className="msbTextY"
            type="password"
            placeholder="Enter password" 
            value={queryPassword}
            onChange={e => setQueryPassword(e.target.value)} 
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