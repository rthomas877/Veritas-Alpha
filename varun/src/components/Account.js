import React, { useEffect } from 'react';
import Footer from './Footer';
import HeaderSignedIn from './HeaderSignedIn';
import AccountActual from './AccountActual';

function Account() {

    useEffect(() => {
        document.title = "Veritas Alpha | Account";
    }, []);

    return (
        <div>
            <HeaderSignedIn />
            <AccountActual />
            <Footer />
        </div>
    );
}

export default Account;