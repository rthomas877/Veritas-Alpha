import Header from './Header';
import ChartDashboard from './ChartDashboard';
import Break from '../Break';
import MainSearchBar from './MainSearchBar';
import Footer from './Footer';
import React, { useEffect } from 'react';
import Divider from './Divider';
import HeaderSignedIn from './HeaderSignedIn';

function Home() {  
  
  useEffect(() => {
    document.title = "Veritas Alpha";
  }, []);
  
  return (
    <div className='home'> 
      <Header /> {/* Ensure Header is used properly */}
      {/* <HeaderSignedIn /> */}
      <ChartDashboard />
      <Break />
      <MainSearchBar />
      <Footer />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
    </div>
  );
}

export default Home;