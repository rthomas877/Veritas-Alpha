import Header from './Header';
// import ChartDashboard from './ChartDashboard';
import Footer from './Footer';
// import Break from '../Break';
import Bio from './Bio';
import React, { useEffect } from 'react';
import Divider from './Divider';
import HeaderSignedIn from './HeaderSignedIn';


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
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
    </>
  );
}

export default About;