import Header from './Header';
import Footer from './Footer';
import QuestionList from './QuestionsList';
import React, { useEffect } from 'react';
import HeaderSignedIn from './HeaderSignedIn';



function FAQs() {    

  useEffect(() => {
    document.title = "Veritas Alpha | FAQs";
  }, []);

  return (
    <> 
      {localStorage.getItem('token') ? <HeaderSignedIn /> : <Header />}
      <QuestionList />
      <Footer />
    </>
  );
}

export default FAQs;