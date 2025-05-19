import Header from './Header';
import ChartDashboard from './ChartDashboard';
import Break from '../Break';
import MainSearchBar from './MainSearchBar';
import Footer from './Footer';
import React, { useEffect } from 'react';

function Home() {  
  
  useEffect(() => {
    document.title = "Veritas Alpha";
  }, []);
  
  return (
    <> 
      <Header /> {/* Ensure Header is used properly */}
      <ChartDashboard />
      <Break />
      <MainSearchBar />
      <Footer />
    </>
  );
}

export default Home;