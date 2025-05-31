import { useState, useEffect } from "react";

function useStockData(ticker) {
  const [priceReal, setPriceReal] = useState("-");
  const [changeReal, setChangeReal] = useState("0.00");
  const [percentReal, setPercentReal] = useState("0.00%");
  const [timeReal, setTimeReal] = useState("N/A");
  const [change, setChange] = useState("N/A");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/price?symbol=${ticker}`);
        const data = await response.json();
        setPriceReal(data.price);
        setChangeReal(data.change);
        setPercentReal(data.percent);
        setTimeReal(data.time);
        setChange(data.changeReal);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData(); // fetch immediately on mount

    const interval = setInterval(fetchData, 1800000); // fetch every 30 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, [ticker]);

  return { priceReal, changeReal, percentReal, timeReal, change };
}

export default useStockData;
