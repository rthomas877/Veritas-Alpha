import Divider from "./Divider";

function Footer() {

    const year = new Date().getFullYear();

    return (
        <>
            <h1 className="footer1">© {year} Veritas Alpha - All Rights Reserved | Powered by&nbsp; 
            <a href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer">
                <img src="/yahoo.png" alt="footerYahoo" className="Yahoo"/>
            </a>
            </h1>
        </>
    );
}

export default Footer;