import Header from './Header';
// import ChartDashboard from './ChartDashboard';
import Footer from './Footer';
// import Break from '../Break';
import Bio from './Bio';
import React, { useEffect } from 'react';


function About() {    

  useEffect(() => {
    document.title = "Veritas Alpha | About";
  }, []);

  return (
    <> 
      <Header />
      {/* <ChartDashboard />
      <Break /> */}
      <Bio />
      <Footer />
    </>
  );
}

export default About;