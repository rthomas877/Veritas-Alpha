import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import WatchlistActual from './WatchlistActual';
import HeaderSignedIn from './HeaderSignedIn';


function Watchlist() {

    useEffect(() => {
        document.title = "Veritas Alpha | Watchlist";
    }, []);

    return (
        <div>
            {localStorage.getItem('token') ? <HeaderSignedIn /> : <Header />}
            <WatchlistActual />
            <Footer />
        </div>
    );
}

export default Watchlist;