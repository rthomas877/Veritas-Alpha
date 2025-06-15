import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import Header from './Header';
import Footer from './Footer';
import LightWeightSB from './LightWeightSB';
import GetGraphData from './GetGraphData';
import Divider from './Divider';

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
  let candlestick = useRef(true); // to keep candlestick states across states
  
  // Extract query parameters
  const query = new URLSearchParams(search).get('q');
  const timeRange = new URLSearchParams(search).get('t') || '3mo';
  
  // Get stock data (now cached and optimized)
  const { 
    dates, open, high, low, close, price, symbol, exchangeName, 
    longName, prevClose, error, loading, timeR, quoteType, total_revenue_yearly,
    time_yearly
  } = GetGraphData({ ticker: query, time: timeRange });
  
  // Component state
  const [showContent, setShowContent] = useState(false);
  const [useCandlestick, setUseCandlestick] = useState(true);
  const [dataDivider, setDataDivider] = useState(1000)
  const [dataDividerVerbose, setDataDividerVerbose] = useState("Thousands")
  
  const priceChange = () => {
    if (!price || !prevClose) return { amount: 0, percentage: 0, direction: 'neutral' };
    
    const amount = price - prevClose;
    const percentage = (amount / prevClose) * 100;
    const direction = amount > 0 ? 'up' : amount < 0 ? 'down' : 'neutral';
    
    return { amount, percentage, direction };
  };
  
  const colors = () => {
    if (priceChange().direction === 'up') {
      return { line: '#3d9970', fill: 'rgba(163, 204, 184, 0.4)' };
    } else if (priceChange().direction === 'down') {
      return { line: '#ff4136', fill: 'rgba(255, 164, 158, 0.4)' };
    }
    return { line: '#666', fill: 'rgba(166, 166, 166, 0.4)' };
  };
  
  const currentTimeConfig = () => {
    return TIME_RANGES[timeR] || TIME_RANGES['3mo'];
  };
  
  const handleTimeRangeChange = (newTimeRange) => {
    if (query) {
      navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=${newTimeRange}`);
      if (newTimeRange !== "1d" && newTimeRange !== "5d") {
        setUseCandlestick(candlestick.current);
      }
    }
  };
  
  const handleGraphTypeChange = (isCandlestick) => {
    setUseCandlestick(isCandlestick);
    candlestick.current = isCandlestick;
  };
  
  // Effects
  useEffect(() => {
    if (!loading) {
      document.title = error === null && exchangeName !== "" && quoteType !== "ECNQUOTE"
        ? `Veritas Alpha | ${longName}` 
        : "Veritas Alpha | No Results";
      setShowContent(true);

      if (quoteType === "EQUITY") {
        if (total_revenue_yearly[3] > 10000000000) {
          setDataDivider(1000000)
          setDataDividerVerbose("Millions")
        } else if (total_revenue_yearly[3] <= 10000000000){
          setDataDivider(1000)
          setDataDividerVerbose("Thousands")
        }
      }
      
      // Set chart type based on time range
      if (currentTimeConfig().candlestick !== undefined) {
        if (timeRange === "1d" || timeRange === "5d") {
          setUseCandlestick(false);
        } else {
          setUseCandlestick(candlestick.current);
        } 
      }
    }
    // eslint-disable-next-line
  }, [error, longName, loading, currentTimeConfig().candlestick, exchangeName, candlestick, timeRange]);
  
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
    if (error || exchangeName === "" || longName === "") {
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

    const prevPriceDisplay = prevClose?.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const changeDisplay = priceChange().amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const percentageDisplay = priceChange().percentage.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    const subtitleClass = priceChange().direction === 'up' ? 'stockSubtitle' : 
                         priceChange().direction === 'down' ? 'stockSubtitleR' : 'stockSubtitleGray';
    
    const arrow = priceChange().direction === 'up' ? '↑' : 
                  priceChange().direction === 'down' ? '↓' : '-';
    
    return (
      <>
        <h2 className="stockTitle">
          {longName} ({symbol}:{exchangeName}) - ${priceDisplay}
        </h2>
        <h2 className={subtitleClass}>
          {priceChange().direction === 'up' ? '+' : ''}{changeDisplay}&nbsp;
          ({percentageDisplay}%)&nbsp;
          {arrow} {currentTimeConfig().displayName}  {currentTimeConfig().displayName === 'today' ? " — Previous Close: $" + prevPriceDisplay : null}
        </h2>
      </>
    );
  };
  
  // const renderDataChart = (type) => {

  //   const yData = [type[3], type[2], type[1], type[0]];

  //   const colors = yData.map(v => v >= 0 ? '#004226ff' : '#b22222');

  //   const plotData = [{
  //     y: yData,
  //     marker: { color: colors },
  //     type: 'bar',
  //     showlegend: false,
  //     hoverinfo: 'y',
  //     width: .75
  //   }];

  //   const layout = {
  //     margin: { t: 0, b: 0, l: 0, r: 0 },
  //     xaxis: { visible: false },
  //     yaxis: {
  //       visible: false,
  //       autorange: true,
  //     },  
  //     autosize: true,
  //     paper_bgcolor: 'transparent',
  //     plot_bgcolor: 'transparent',
  //   };  

  //   return <div className='tinyChart'><Plot data={plotData} layout={layout} config={{ displayModeBar: false, staticPlot: true, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler={true}/></div>;
  // }

  const renderDataChart = (type) => {
    const yData = [type[3], type[2], type[1], type[0]];
    const colors = yData.map(v => v >= 0 ? '#004226ff' : '#b22222');
  
    const plotData = [{
      y: yData,
      marker: { color: colors },
      type: 'bar',
      showlegend: false,
      hoverinfo: 'y',
      width: .75
    }];
  
    const layout = {
      margin: { t: 0, b: 0, l: 0, r: 0 },
      xaxis: { visible: false },
      yaxis: {
        visible: false,
        autorange: true,
      },  
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
    };  
  
    return (
      <div className='tinyChart'>
        <Plot 
          data={plotData} 
          layout={layout} 
          config={{ displayModeBar: false, staticPlot: true, responsive: true }} 
          style={{ width: '100%', height: '100%' }} 
          useResizeHandler={true}
        />
      </div>
    );
  };
  
  const renderFinancialDataTable = () => {
    // Sample data - you can replace these with actual data from your API
    const tableData = [
      {
        label: 'Revenue',
        data: total_revenue_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'EBITDA',
        data: total_revenue_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Profit',
        data: [-40000000, 50000000, -40000000, 50000000], // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Mullah', // Replace with actual metric name
        data: [40000000, 50000000, 40000000, 50000000], // Replace with actual data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      }
    ];
  
    return (
      <div className='faqList'>
        <h2 className="FAQTitle1">
          Financial Data for {longName}
        </h2>
        <hr />
        <h2 className='clarify'>*All values USD {dataDividerVerbose}</h2>
        
        <table className='stockDataTable'>
          <thead>
            <tr>
              <th className='topOfTable'>Fiscal Year</th>
              <th className='topOfTable'>{Math.floor(time_yearly[0]) - 3}</th>
              <th className='topOfTable'>{Math.floor(time_yearly[0]) - 2}</th>
              <th className='topOfTable'>{Math.floor(time_yearly[0]) - 1}</th>
              <th className='topOfTable'>{time_yearly[0]}</th>
              <th className='tableCell'>4-Year Trend</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <th className='leftsideTable'>{row.label}</th>
                <td>{row.formatValue(row.data[3])}</td>
                <td>{row.formatValue(row.data[2])}</td>
                <td>{row.formatValue(row.data[1])}</td>
                <td>{row.formatValue(row.data[0])}</td>
                <td className='tableCell'>{renderDataChart(row.data)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h1>{total_revenue_yearly}</h1>
      </div>
    );
  };

  const renderChart = () => {
    if (error || !close.length || exchangeName === "" || longName === "") {
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
      line: { color: colors().line },
      fill: 'tozeroy',
      fillcolor: colors().fill,
    };
    
    const yAxisRange = close.length > 0 ? [
      Math.min(...low) * 0.98,
      Math.max(...high) * 1.02
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
              fixedrange: true,
              automargin: true,
              
            },
            yaxis: {
              tickformat: ',.2f',
              nticks: 7,
              fixedrange: true,
              autorange: false, // keeps line chart yaxis from starting at zero
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
          
          {error === null && !loading && exchangeName !== "" && longName !== "" ? 
            renderTimeRangeButtons() : 
            <h2 className="loading"> </h2>
          }
          
          {renderChart()}
        </div>
      ) : (
        <h2 className="loading">Loading...</h2>
      )}
      <div>
        {error === null && quoteType === "EQUITY" && !(exchangeName === "" || longName === "") ? (
          <>
            <Divider />
            {renderFinancialDataTable()}
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default StockScreen;