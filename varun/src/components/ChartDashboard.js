import DashboardBox from "./DashboardBox";

function ChartDashboard() {
    const data = [
        { title: "^DJI", name: "DJIA" },
        { title: "^GSPC", name: "S&P500" },
        { title: "^IXIC", name: "NASDAQ" },
        { title: "BTC-USD", name: "BTC" },
        { title: "AAPL", name: "AAPL" },
        { title: "NVDA", name: "NVDA" },
        { title: "MSTR", name: "MSTR" },
        { title: "QQQ", name: "QQQ" },
    ];    

    return (
        <div className="chartDashboard">
            {data.map((item, index) => (
                <DashboardBox key={index} title={item.title} name={item.name} />
            ))}
        </div>
    );
}

export default ChartDashboard;