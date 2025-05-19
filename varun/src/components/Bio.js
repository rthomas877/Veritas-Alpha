function Bio() {
    return (
        <div className="Bio">
            <img src="/RyanBio1.jpg" alt="BioPhoto" className="BioPhoto" />
            <div className="textBio">
                <h1 className="CenterTag">
                    About 
                </h1>
                <h2 className="DescriptionBio">
                    My name is Ryan Thomas and I'm a Computer Science student at the University of Maryland, driven by a passion for both finance and technology. I built Veritas Alpha to take a deep dive into stock analysis, reveal market trends, and blend data-driven insights with smart investing. Whether you're looking to find new opportunities or sharpen your strategy, I hope you find something valuable!
                </h2>
                <br></br>
                <h2 className="DescriptionBio">
                    Feel free to take a look at my resume, LinkedIn or GitHub account!
                </h2>
                <br></br>
                <div className="brandImages">
                    <a href="https://drive.google.com/file/d/1olpE8aOJKz8xDI57XTzrAH278a0KMp97/view?usp=sharing" target="_blank" rel="noreferrer">
                        <img src="/pdf.webp" alt="BrandLogo" className="BrandLogo" />
                    </a>
                    <a href="https://www.linkedin.com/in/ryan-thomas-807585260/" target="_blank" rel="noreferrer">
                        <img src="/lilogo.png" alt="BrandLogo" className="BrandLogo" />
                    </a>
                    <a href="https://github.com/rthomas877" target="_blank" rel="noreferrer">
                        <img src="/gitlogo.png" alt="BrandLogo" className="BrandLogo" />
                    </a>
                </div> 
            </div>
        </div>
        
    );
}

export default Bio;