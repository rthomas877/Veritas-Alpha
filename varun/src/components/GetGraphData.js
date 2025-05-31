import { useState, useEffect, useRef } from "react";

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
  const [prevClose, setPrevClose] = useState(null);
  const [error, setError] = useState(null);
  const [timeR, setTimeR] = useState('');
  const [loading, setLoading] = useState(true);

  // Cache for storing all time range data for each stock
  const allDataCache = useRef({});
  const currentSymbol = useRef('');

  const updateStateFromTimeRange = (allData, selectedTime) => {
    const timeRangeData = allData.timeRanges[selectedTime];
    
    if (timeRangeData) {
      setDates(timeRangeData.dates || []);
      setOpen(timeRangeData.open || []);
      setHigh(timeRangeData.high || []);
      setLow(timeRangeData.low || []);
      setClose(timeRangeData.close || []);
      setPrevClose(timeRangeData.prevClose || null);
      setTimeR(selectedTime);
    } else {
      // Fallback to empty arrays if time range not available
      setDates([]);
      setOpen([]);
      setHigh([]);
      setLow([]);
      setClose([]);
      setPrevClose(null);
      setTimeR(selectedTime);
    }
    
    setPrice(allData.price || null);
    setSymbol(allData.symbol || '');
    setExchangeName(allData.exchangeName || '');
    setLongName(allData.longName || '');
    setError(null);
  };

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    const normalizedTicker = ticker.toUpperCase();
    const selectedTime = time || '3mo';

    // If we have cached data for this symbol, use it
    if (allDataCache.current[normalizedTicker]) {
      updateStateFromTimeRange(allDataCache.current[normalizedTicker], selectedTime);
      setLoading(false);
      return;
    }

    // If this is a different symbol, clear the current data and fetch new data
    if (currentSymbol.current !== normalizedTicker) {
      setLoading(true);
      currentSymbol.current = normalizedTicker;
    }

    const fetchAllData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/stockData?symbol=${encodeURIComponent(ticker)}`);
        const data = await response.json();

        if (response.ok && !data.error) {
          // Cache the complete data set
          allDataCache.current[normalizedTicker] = data;
          
          // Update state with the requested time range
          updateStateFromTimeRange(data, selectedTime);
        } else {
          setSymbol(normalizedTicker);
          setError(data.error || 'Failed to fetch data');
        }
      } catch (error) {
        setSymbol(normalizedTicker);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [ticker, time]);

  // When only time changes (same symbol), update from cache
  useEffect(() => {
    const normalizedTicker = ticker?.toUpperCase();
    const selectedTime = time || '3mo';
    
    if (normalizedTicker && 
        currentSymbol.current === normalizedTicker && 
        allDataCache.current[normalizedTicker] && 
        !loading) {
      updateStateFromTimeRange(allDataCache.current[normalizedTicker], selectedTime);
    }
  }, [time, ticker, loading]);

  return { 
    dates, 
    open, 
    high, 
    low, 
    close, 
    price, 
    symbol, 
    exchangeName, 
    longName, 
    prevClose, 
    error, 
    loading, 
    timeR 
  };
}

export default GetGraphData;