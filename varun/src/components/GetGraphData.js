import { useState, useEffect } from "react";

function GetGraphData({ ticker }) {
  const [dates, setDates] = useState([]);
  const [open, setOpen] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);
  const [close, setClose] = useState([]);
  const [price, setPrice] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [exchangeName, setExchangeName] = useState('');
  const [longName, setLongName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/graphData?symbol=${encodeURIComponent(ticker)}`);
        const data = await response.json();

        if (response.ok) {
          setDates(data.dates || []);
          setOpen(data.open || []);
          setHigh(data.high || []);
          setLow(data.low || []);
          setClose(data.close || []);
          setPrice(data.price || null);
          setSymbol(data.symbol || '');
          setExchangeName(data.exchangeName || '');
          setLongName(data.longName || '');
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [ticker]);

  return { dates, open, high, low, close, price, symbol, exchangeName, longName, error };
}

export default GetGraphData;
