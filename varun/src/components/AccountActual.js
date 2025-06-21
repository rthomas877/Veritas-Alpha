import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

function AccountActual() {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userEmail, setUserEmail] = useState(null);


    const handleSignOut = (e) => {
        localStorage.removeItem('token');
        navigate(`/`);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserEmail(decoded.sub || decoded.email); // 'sub' is the subject field in the JWT
            setUserName(decoded.name);
            setUserFirstName(decoded.name.split(' ')[0]); // extract first name directly from decoded.name
            console.log('Decoded token:', decoded);
          } catch (err) {
            console.error('Invalid token', err);
            localStorage.removeItem('token'); // optional: cleanup
          }
        }
      }, []); 

    return (
        <div className="faqList">
            <h1 className="FAQTitle">Account</h1>
            <hr />
            <h2>{userName}</h2>
            <h2>{userEmail}</h2>
            <br></br>
            <br></br>
            <button
                onClick={handleSignOut}
                className="searchButtonYO">
                Sign Out
            </button>
        </div>
    );
}

export default AccountActual;