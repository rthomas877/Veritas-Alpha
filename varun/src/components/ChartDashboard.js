import DashboardBox from "./DashboardBox";
import { useEffect, useState } from "react";

function ChartDashboard() {
    const data = [
        { title: "DJIA", price: "12,321.11", direction: "▲", dollarChange: "+36.18", percentChange: "+0.65%", time: "4:58:44 PM"},
        { title: "S&P 500", price: "12,321.11", direction: "▲", dollarChange: "+36.18", percentChange: "+0.65%", time: "4:58:44 PM"},
        { title: "NASDAQ", price: "12,321.11", direction: "▲", dollarChange: "+36.18", percentChange: "+0.65%", time: "4:58:44 PM"},
        { title: "BTC", price: "103,321.11", direction: "▲", dollarChange: "+1830.00", percentChange: "+3.43%", time: "9:58:44 AM"},
        { title: "AAPL", price: "212.69", direction: "-", dollarChange: "-1.31", percentChange: "-0.61%", time: "4:58:44 PM"},
        { title: "NVDA", price: "2,321.11", direction: "▲", dollarChange: "+36.18", percentChange: "+0.65%", time: "4:58:44 PM"},
        { title: "MSTR", price: "299.11", direction: "▲", dollarChange: "2.18", percentChange: "0.65%", time: "4:58:44 PM"},
        { title: "AMZN", price: "2,321.11", direction: "▲", dollarChange: "+36.18", percentChange: "+0.65%", time: "4:58:44 PM"},
    ];
        
    const colorCheck = (price) => {
        if (price < 0) {
            return "data-box-red";
        } else if (price > 0) {
            return "data-box-green";
        } else {
            return "data-box-grey";
        }
    }

    return (
        <div className="chartDashboard">
            {data.map((item, index) => (
                <DashboardBox key={index} title={item.title} price={item.price} direction={item.direction} dollarChange={item.dollarChange} percentChange={item.percentChange} time={item.time} colorClass={colorCheck(item.dollarChange)}/>
            ))}
        </div>
    );
}

export default ChartDashboard;