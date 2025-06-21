import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import LoginActual from './LoginActual';
import HeaderSignedIn from './HeaderSignedIn';
import { useState } from 'react';



function Login() {

    useEffect(() => {
        document.title = "Veritas Alpha | Login";
    }, []);

    return (
        <div>
            {localStorage.getItem('token') ? <HeaderSignedIn /> : <Header />}
            <LoginActual />
            <Footer />
        </div>
    );
}

export default Login;