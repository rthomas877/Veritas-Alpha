import { useState, useEffect } from "react";

function GetGraphData({ ticker, time }) {
  const [dates, setDates] = useState([]);
  const [open, setOpen] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);
  const [close, setClose] = useState([]);
  const [price, setPrice] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [exchangeName, setExchangeName] = useState('');
  const [longName, setLongName] = useState('');
  const [prevClose, setPrevClose] = useState('');
  const [error, setError] = useState(null);
  const [timeR, setTimeR] = useState('');

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/graphData?symbol=${encodeURIComponent(ticker)}&time=${encodeURIComponent(time)}`);
        const data = await response.json();

        if (response.ok) {
          setDates(data.dates || []);
          setOpen(data.open || []);
          setHigh(data.high || []);
          setLow(data.low || []);
          setClose(data.close || []);
          setPrice(data.price || null);
          setPrevClose(data.prevClose || null);
          setSymbol(data.symbol || '');
          setExchangeName(data.exchangeName || '');
          setLongName(data.longName || '');
          setError(null);
          setTimeR(data.time);
        } else {
          setLoading(false);
          setSymbol(ticker || '');
          setError(data.error || 'Failed to fetch data');
        }
      } catch (error) {
        setLoading(false);
        setSymbol(ticker || '');
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, time]);

  return { dates, open, high, low, close, price, symbol, exchangeName, longName, prevClose, error, loading, timeR };
}

export default GetGraphData;
