function QuestionList() {
    return(
        <div className="faqList">
            <h1 className="FAQTitle">FAQs</h1>
            <h2 className="FAQCategory">General Questions:</h2>
            <ol className="FAQQuestions">
                <li>What is the stock market?</li>
                <h3 className="FAQAnswer">The stock market is a platform where investors can buy and sell shares of publicly traded companies.</h3>
                <li>How do I get started with investing?</li>
                <h3 className="FAQAnswer">You'll need to open a brokerage account, fund it, and research stocks before making any investments.</h3>
                <li>Is it safe to invest in the stock market?</li>
                <h3 className="FAQAnswer">Investing involves risks, but diversifying your portfolio and investing for the long term can reduce risk. Understanding what you’re investing in is paramount to your success.</h3>
            </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Account & Registration:</h2>
            <ol className="FAQQuestions">
                <li>Do I need to create an account to use this site?</li>
                <h3 className="FAQAnswer">Basic features are available without an account, but creating one gives access to personalized tools and watchlists.</h3>
                <li>How do I reset my password?</li>
                <h3 className="FAQAnswer">Click the "Forgot Password" link on the login page and follow the instructions sent to your email.</h3>
                </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Data & Tools:</h2>
            <ol className="FAQQuestions">
                <li>Where does the stock data come from?</li>
                <h3 className="FAQAnswer">We source real-time market data from Yahoo Finance.</h3>
                <li>How often is the data updated?</li>
                <h3 className="FAQAnswer">Real-time for some exchanges; otherwise, quotes may be delayed by a few minutes.</h3>
                <li>Can I create a watchlist or portfolio?</li>
                <h3 className="FAQAnswer">Yes, registered users can create custom watchlists and track their portfolio performance.</h3>
                </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Analysis & Features:</h2>
            <ol className="FAQQuestions">
                <li>What tools are available for stock analysis?</li>
                <h3 className="FAQAnswer">We offer technical charts, key financial ratios, and historical data.</h3>
                <li>How do I use AI features?</li>
                <h3 className="FAQAnswer">Users can get access to AI analysis once they sign up for an account.</h3>
                </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Financial Education:</h2>
            <ol className="FAQQuestions">
                <li>Do you offer resources for beginners?</li>
                <h3 className="FAQAnswer">Yes, our “Learn” tab contains links to multiple articles and resources to further your financial education.</h3>
                <li>What is the difference between a stock and an ETF?</li>
                <h3 className="FAQAnswer">A stock represents ownership in one company, while an ETF is a basket of securities traded as a single unit.</h3>
                </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Costs & Subscriptions:</h2>
            <ol className="FAQQuestions">
                <li>Is this website free to use?</li>
                <h3 className="FAQAnswer">Yes.</h3>
                </ol>
            <hr className="breakLine"/>
            <h2 className="FAQCategory">Privacy & Security:</h2>
            <ol className="FAQQuestions">
                <li>How is my data protected?</li>
                <h3 className="FAQAnswer">We use encryption and other security measures to protect your personal information.</h3>
                <li>Do you sell my personal information?</li>
                <h3 className="FAQAnswer">No, we do not sell or share your personal information with third parties.</h3>
                </ol>
        </div>
    );
}

export default QuestionList