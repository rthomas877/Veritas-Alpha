import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import LearnContent from './LearnContent';


function Learn() {    

  useEffect(() => {
    document.title = "Veritas Alpha | Learn";
  }, []);

  return (
    <> 
      <Header />
      <LearnContent />
      <Footer />
    </>
  );
}

export default Learn;