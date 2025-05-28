import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';


function Learn() {    

  useEffect(() => {
    document.title = "Veritas Alpha | Learn";
  }, []);

  return (
    <> 
      <Header />
      <Footer />
    </>
  );
}

export default Learn;