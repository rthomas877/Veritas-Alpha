import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import CreateACCActual from './CreateACCActual';
import HeaderSignedIn from './HeaderSignedIn';


function CreateACC() {

    useEffect(() => {
        document.title = "Veritas Alpha | Create Account";
    }, []);

    return (
        <div>
            <Header />
            <CreateACCActual />
            <Footer />
        </div>
    );
}

export default CreateACC;