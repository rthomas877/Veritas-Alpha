import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import LearnContent from './LearnContent';
import HeaderSignedIn from './HeaderSignedIn';



function Learn() {    

  useEffect(() => {
    document.title = "Veritas Alpha | Learn";
  }, []);

  return (
    <> 
      {localStorage.getItem('token') ? <HeaderSignedIn /> : <Header />}
      <LearnContent />
      <Footer />
    </>
  );
}

export default Learn;