import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import Header from './Header';
import Footer from './Footer';
import LightWeightSB from './LightWeightSB';
import GetGraphData from './GetGraphData';

const TIME_RANGES = {
  '1d': { label: '1D', displayName: 'today', candlestick: false },
  '5d': { label: '5D', displayName: 'past 5 days', candlestick: false },
  '1mo': { label: '1M', displayName: 'past month', candlestick: true },
  '3mo': { label: '3M', displayName: 'past 3 months', candlestick: true },
  '6mo': { label: '6M', displayName: 'past 6 months', candlestick: true },
  'ytd': { label: 'YTD', displayName: 'year to date', candlestick: true },
  '1y': { label: '1Y', displayName: 'past year', candlestick: true },
  '5y': { label: '5Y', displayName: 'past 5 years', candlestick: true },
  '10y': { label: '10Y', displayName: 'past 10 years', candlestick: true },
  '20y': { label: '20Y', displayName: 'past 20 years', candlestick: true },
  'max': { label: 'Max', displayName: 'all time', candlestick: true }
};

function StockScreen() {
  const { search } = useLocation();
  const navigate = useNavigate();
  
  // Extract query parameters
  const query = new URLSearchParams(search).get('q');
  const timeRange = new URLSearchParams(search).get('t') || '3mo';
  
  // Get stock data (now cached and optimized)
  const { 
    dates, open, high, low, close, price, symbol, exchangeName, 
    longName, prevClose, error, loading, timeR 
  } = GetGraphData({ ticker: query, time: timeRange });
  
  // Component state
  const [showContent, setShowContent] = useState(false);
  const [useCandlestick, setUseCandlestick] = useState(true);
  
  // Memoized calculations
  const priceChange = useMemo(() => {
    if (!price || !prevClose) return { amount: 0, percentage: 0, direction: 'neutral' };
    
    const amount = price - prevClose;
    const percentage = (amount / prevClose) * 100;
    const direction = amount > 0 ? 'up' : amount < 0 ? 'down' : 'neutral';
    
    return { amount, percentage, direction };
  }, [price, prevClose]);
  
  const colors = useMemo(() => {
    if (priceChange.direction === 'up') {
      return { line: '#3d9970', fill: 'rgba(163, 204, 184, 0.4)' };
    } else if (priceChange.direction === 'down') {
      return { line: '#ff4136', fill: 'rgba(255, 164, 158, 0.4)' };
    }
    return { line: '#666', fill: 'rgba(166, 166, 166, 0.4)' };
  }, [priceChange.direction]);
  
  const currentTimeConfig = useMemo(() => {
    return TIME_RANGES[timeR] || TIME_RANGES['3mo'];
  }, [timeR]);
  
  // Navigation handlers - now much faster since no API call needed
  const handleTimeRangeChange = useCallback((newTimeRange) => {
    if (query) {
      navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=${newTimeRange}`);
    }
  }, [query, navigate]);
  
  const handleGraphTypeChange = useCallback((isCandlestick) => {
    setUseCandlestick(isCandlestick);
  }, []);
  
  // Effects
  useEffect(() => {
    if (!loading) {
      document.title = error === null 
        ? `Veritas Alpha | ${longName}` 
        : "Veritas Alpha | No Results";
      setShowContent(true);
      
      // Set chart type based on time range
      if (currentTimeConfig.candlestick !== undefined) {
        setUseCandlestick(currentTimeConfig.candlestick);
      }
    }
  }, [error, longName, loading, currentTimeConfig.candlestick]);
  
  // Render helpers
  const renderTimeRangeButtons = () => (
    <div className="timeButtons">
      {Object.entries(TIME_RANGES).map(([key, config]) => (
        <button
          key={key}
          className={timeR === key ? 'timeRangeButtonClicked' : 'timeRangeButton'}
          onClick={() => handleTimeRangeChange(key)}
        >
          {config.label}
        </button>
      ))}
      
      {timeR !== '1d' && timeR !== '5d' && (
        <div className="rightButtons">
          <button
            className={useCandlestick ? 'graphTypeButtonClicked' : 'graphTypeButton'}
            onClick={() => handleGraphTypeChange(true)}
          >
            Candlestick
          </button>
          <button
            className={!useCandlestick ? 'graphTypeButtonClicked' : 'graphTypeButton'}
            onClick={() => handleGraphTypeChange(false)}
          >
            Line
          </button>
        </div>
      )}
    </div>
  );
  
  const renderStockInfo = () => {
    if (error) {
      return (
        <>
          <h2 className="stockTitle">No results for {symbol}</h2>
          <h2 className="stockSubtitleGray"> </h2>
        </>
      );
    }
    
    const priceDisplay = price?.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const changeDisplay = priceChange.amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const percentageDisplay = priceChange.percentage.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const subtitleClass = priceChange.direction === 'up' ? 'stockSubtitle' : 
                         priceChange.direction === 'down' ? 'stockSubtitleR' : 'stockSubtitleGray';
    
    const arrow = priceChange.direction === 'up' ? '↑' : 
                  priceChange.direction === 'down' ? '↓' : '-';
    
    return (
      <>
        <h2 className="stockTitle">
          {longName} ({symbol}:{exchangeName}) - ${priceDisplay}
        </h2>
        <h2 className={subtitleClass}>
          {priceChange.direction === 'up' ? '+' : ''}{changeDisplay}&nbsp;
          ({percentageDisplay}%)&nbsp;
          {arrow} {currentTimeConfig.displayName}
        </h2>
      </>
    );
  };
  
  const renderChart = () => {
    if (error || !close.length) {
      return <h2 className="fillerSpace"> </h2>;
    }
    
    const chartData = useCandlestick ? {
      x: dates,
      open: open,
      high: high,
      low: low,
      close: close,
      type: 'candlestick',
      name: 'Stock Data',
    } : {
      x: dates,
      y: close,
      type: 'scatter',
      mode: 'lines',
      name: 'Close Price',
      line: { color: colors.line },
      fill: 'tozeroy',
      fillcolor: colors.fill,
    };
    
    const yAxisRange = close.length > 0 ? [
      Math.min(...close) * 0.98,
      Math.max(...close) * 1.02
    ] : undefined;
    
    return (
      <div>
        <Plot
          className="stockGraph"
          data={[chartData]}
          layout={{
            margin: { t: 10, b: 40, l: 75, r: 40 },
            hovermode: 'x',
            autosize: true,
            paper_bgcolor: '#f5f5dc',
            plot_bgcolor: '#f5f5dc',
            xaxis: {
              rangeslider: { visible: false },
              type: 'category',
              nticks: 5,
              fixedrange: true
            },
            yaxis: {
              tickformat: ',.2f',
              nticks: 7,
              fixedrange: true,
              range: yAxisRange
            }
          }}
          useResizeHandler={true}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100vw", height: "80vh" }}
        />
      </div>
    );
  };
  
  return (
    <>
      <Header />
      <LightWeightSB />
      
      {showContent ? (
        <div>
          {renderStockInfo()}
          
          {error === null && !loading ? 
            renderTimeRangeButtons() : 
            <h2 className="loading"> </h2>
          }
          
          {renderChart()}
        </div>
      ) : (
        <h2 className="loading">Loading...</h2>
      )}
      
      <Footer />
    </>
  );
}

export default StockScreen;