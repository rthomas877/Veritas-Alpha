import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function CreateACCActual() {

    const [queryName, setQueryName] = useState('');
    const [queryEmail, setQueryEmail] = useState('');
    const [queryPassword, setQueryPassword] = useState('');
    const [response, setResponse] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [goodName, setGoodName] = useState(false);
    const [goodEmail, setGoodEmail] = useState(false);
    const [goodPassword, setGoodPassword] = useState(false);

    const nameRequirements = [
        {
            text: "Must contain no numbers",
            valid: !/\d/.test(queryName),
        },
        {
            text: "Must start with a capital letter",
            valid: /^[A-Z]/.test(queryName),
        },
    ];

    const namePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRequirement = namePattern.test(queryEmail);

    const pattern = /^(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    const passwordRequirement = pattern.test(queryPassword);




    const navigate = useNavigate();
    
      const handleAddUser = (e) => {
        if (goodName === true && goodEmail === true && goodPassword === true) {
            fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                name: queryName,
                email: queryEmail,
                password: queryPassword
                })
            })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            .catch(error => console.error('Error:', error));
            setResponse(response);
        }
      };

          // UseEffect for name
        useEffect(() => {
            setGoodName(nameRequirements.every(req => req.valid));
        }, [queryName]);

        // UseEffect for email
        useEffect(() => {
            setGoodEmail(emailRequirement);
        }, [queryEmail]);

        // UseEffect for password
        useEffect(() => {
            setGoodPassword(passwordRequirement);
        }, [queryPassword]);


    return (
        <div className="faqList">
            <h1 className="FAQTitle">Create Account</h1>
            <br></br>
            <input
                className="msbTextY"
                type="text"
                placeholder="Enter name" 
                value={queryName}
                onChange={e => setQueryName(e.target.value)}
            />
            {queryName !== "" && nameRequirements.some(req => !req.valid) && (
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                    {nameRequirements
                        .filter(req => !req.valid)
                        .map((req, index) => (
                            <li
                                key={index}
                                style={{
                                    color: "red",
                                    listStyle: "disc",
                                    fontSize: "0.9rem"
                                }}
                            >
                                {req.text}
                            </li>
                        ))}
                </ul>
            )}
            <div>
                <input
                    className="msbTextY"
                    type="text"
                    placeholder="Enter email" 
                    value={queryEmail}
                    onChange={e => setQueryEmail(e.target.value)}
                />
                {queryEmail !== "" && !emailRequirement && (
                        <p style={{ color: "red", marginTop: "5px" }}>
                            Must use valid email
                        </p>
                )}
            </div>
            <div>
                <div>
                    <input
                        className="msbTextY"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={queryPassword}
                        onChange={e => setQueryPassword(e.target.value)}
                    />
                    {queryPassword !== "" && !passwordRequirement && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                                Password must have 1 number, 1 special character, and be at least 8 characters
                            </p>
                    )}
                </div>
                <button
                    type="button"
                    className='searchButtonY'
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{ marginLeft: "8px" }}
                >
                    {showPassword ? "Hide Password" : "Show Password"}
                </button>
            </div>
            <button
                onClick={handleAddUser}
                className="searchButtonYN">
                Create Account
            </button>
            <h2>{response}</h2>
        </div>
    );
}

export default CreateACCActual;