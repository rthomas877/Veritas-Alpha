import DashboardBox from "./DashboardBox";
import { useNavigate } from 'react-router-dom';


function ChartDashboard() {
    const data = [
        { title: "^DJI", name: "DJIA" },
        { title: "^GSPC", name: "S&P500" },
        { title: "^IXIC", name: "NASDAQ" },
        { title: "BTC-USD", name: "BTC" },
        { title: "NVDA", name: "NVDA" },
        { title: "MSFT", name: "MSFT" },
        { title: "AAPL", name: "AAPL" },
        { title: "MSTR", name: "MSTR" },
    ];   
    
    const navigate = useNavigate();  

    function handleClick(ticker) {
        navigate(`/stock?q=${encodeURIComponent(ticker)}&t=3mo`);
    }

    return (
        <div className="chartDashboard">
            {data.map((item, index) => (
                <button className="dashboardButton" onClick={() => handleClick(item.title)}>
                    <DashboardBox key={index} title={item.title} name={item.name} />
                </button>
            ))}
        </div>
    );
}

export default ChartDashboard;