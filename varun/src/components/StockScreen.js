import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import LightWeightSB from './LightWeightSB';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import GetGraphData from './GetGraphData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StockScreen() {    

  const { search } = useLocation(); // need to use search, it's a special value returned by useLocation
  const query = new URLSearchParams(search).get('q');
  const timeRange = new URLSearchParams(search).get('t');

  const { dates, open, high, low, close, price, symbol, exchangeName, longName, prevClose, error, loading, timeR } = GetGraphData({ ticker: query, time: timeRange });
  const [showContent, setShowContent] = useState(false);
  const [button1d, setButton1d] = useState("timeRangeButton");
  const [button5d, setButton5d] = useState("timeRangeButton");
  const [button1mo, setButton1mo] = useState("timeRangeButton");
  const [button3mo, setButton3mo] = useState("timeRangeButton");
  const [button6mo, setButton6mo] = useState("timeRangeButton");
  const [buttonYtd, setButtonYtd] = useState("timeRangeButton");
  const [button1y, setButton1y] = useState("timeRangeButton");
  const [button5y, setButton5y] = useState("timeRangeButton");
  const [button10y, setButton10y] = useState("timeRangeButton");
  const [button20y, setButton20y] = useState("timeRangeButton");
  const [buttonMax, setButtonMax] = useState("timeRangeButton");
  const [timeQuantifier, setTimeQuantifier] = useState("past 3 months");
  const [useCandlestick, setUseCandleStick] = useState(true);
  const [lineColor, setLineColor] = useState("");
  const [underLineColor, setUnderLineColor] = useState("");
  const [graphTypeButtonC, setGraphTypeButtonC] = useState("graphTypeButton");
  const [graphTypeButtonL, setGraphTypeButtonL] = useState("graphTypeButton");


  const navigate = useNavigate();

  const handleSearch1d = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=1d`);
    }
  };

  const handleSearch5d = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=5d`);
    }
  };

  const handleSearch1mo = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=1mo`);
    }
  };

  const handleSearch3mo = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=3mo`);
    }
  };

  const handleSearch6mo = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=6mo`);
    }
  };

  const handleSearch1y = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=1y`);
    }
  };

  const handleSearch5y = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=5y`);
    }
  };

  const handleSearchYTD = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=ytd`);
    }
  };

  const handleSearch10y = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=10y`);
    }
  };

  const handleSearch20y = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=20y`);
    }
  };

  const handleSearchMAX = (e) => {
    if (query !== "") {
        navigate(`/stock?q=${encodeURIComponent(query.trim())}&t=max`);
    }
  };

  const handleCandle = (e) => {
    setUseCandleStick(true);
    setGraphTypeButtonC("graphTypeButtonClicked");
    setGraphTypeButtonL("graphTypeButton");
  };

  const handleLine = (e) => {
    setUseCandleStick(false);
    setGraphTypeButtonC("graphTypeButton");
    setGraphTypeButtonL("graphTypeButtonClicked");
  };

  useEffect(() => {
    if (!loading) {
      document.title = error === null
        ? "Veritas Alpha | " + longName
        : "Veritas Alpha | No Results";
        setShowContent(true);

      if (price >= prevClose) {
        setLineColor("#3d9970");
        setUnderLineColor("rgba(163, 204, 184, 0.4)");
      } else {
        setLineColor("#ff4136");
        setUnderLineColor("rgba(255, 164, 158, 0.4)");
      }
      

      if (timeR === "1d" && timeRange === "1d") {
        setUseCandleStick(false);
        setTimeQuantifier("today");
        setButton1d("timeRangeButtonClicked");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
      } else if (timeR === "5d" && timeRange === "5d") {
        setUseCandleStick(false);
        setTimeQuantifier("past 5 days");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButtonClicked");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
      } else if (timeR === "1mo" && timeRange === "1mo") {
        setUseCandleStick(true);
        setTimeQuantifier("past month");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButtonClicked");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "3mo" && timeRange === "3mo") {
        setUseCandleStick(true);
        setTimeQuantifier("past 3 months");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButtonClicked");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "6mo" && timeRange === "6mo") {
        setUseCandleStick(true);
        setTimeQuantifier("past 6 months");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButtonClicked");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "ytd" && timeRange === "ytd") {
        setUseCandleStick(true);
        setTimeQuantifier("year to date");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButtonClicked");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "1y" && timeRange === "1y") {
        setUseCandleStick(true);
        setTimeQuantifier("past year");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButtonClicked");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "5y" && timeRange === "5y") {
        setUseCandleStick(true);
        setTimeQuantifier("past 5 years");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButtonClicked");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "10y" && timeRange === "10y") {
        setUseCandleStick(true);
        setTimeQuantifier("past 10 years");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButtonClicked");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "20y" && timeRange === "20y") {
        setUseCandleStick(true);
        setTimeQuantifier("past 20 years");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButtonClicked");
        setButtonMax("timeRangeButton");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      } else if (timeR === "max" && timeRange === "max") {
        setUseCandleStick(true);
        setTimeQuantifier("all time");
        setButton1d("timeRangeButton");
        setButton5d("timeRangeButton");
        setButton1mo("timeRangeButton");
        setButton3mo("timeRangeButton");
        setButton6mo("timeRangeButton");
        setButtonYtd("timeRangeButton");
        setButton1y("timeRangeButton");
        setButton5y("timeRangeButton");
        setButton10y("timeRangeButton");
        setButton20y("timeRangeButton");
        setButtonMax("timeRangeButtonClicked");
        setGraphTypeButtonC("graphTypeButtonClicked");
        setGraphTypeButtonL("graphTypeButton");
      }
    }
  }, [error, longName, loading, timeRange, timeR, price, prevClose]);

  return (
    <> 
      <Header />
      <LightWeightSB />
      {showContent ? 
      <div>
        <h2 className='stockTitle'>
          {error === null ? (
            <>
              {longName} ({symbol}:{exchangeName}) - ${price !== null ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) : ""}
            </>
          ) : (
            "No results for " + symbol
          )}      
        </h2>
        <h2 className={(price > prevClose) ? 'stockSubtitle' : (price < prevClose) ? 'stockSubtitleR' : 'stockSubtitleGray'}>
          {error === null ? (
            <>
              {price > prevClose ? '+' : ''}
              {(price - prevClose).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&nbsp;
              ({(((price - prevClose) / prevClose) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)&nbsp;
              {price > prevClose ? '↑ ' : price < prevClose ? '↓ ' : '- '}
              {timeQuantifier}
            </>
          ) : (
            ""
          )}   
          </h2>

        {error === null && !loading ?
          <div className="timeButtons">
          <button className={button1d} onClick={handleSearch1d}>1D</button>
          <button className={button5d} onClick={handleSearch5d}>5D</button>
          <button className={button1mo} onClick={handleSearch1mo}>1M</button>
          <button className={button3mo} onClick={handleSearch3mo}>3M</button>
          <button className={button6mo} onClick={handleSearch6mo}>6M</button>
          <button className={buttonYtd} onClick={handleSearchYTD}>YTD</button>
          <button className={button1y} onClick={handleSearch1y}>1Y</button>
          <button className={button5y} onClick={handleSearch5y}>5Y</button>
          <button className={button10y} onClick={handleSearch10y}>10Y</button>
          <button className={button20y} onClick={handleSearch20y}>20Y</button>
          <button className={buttonMax} onClick={handleSearchMAX}>Max</button>
          {timeR !== "1d" && timeR !== "5d" ? 
          <div className="rightButtons">
            <button className={graphTypeButtonC} onClick={handleCandle}>Candlestick</button>
            <button className={graphTypeButtonL} onClick={handleLine}>Line</button>
          </div> : null}
        </div>

        : <h2 className='loading'> </h2>}
        {error === null ?
          <div>
            <Plot className='stockGraph'
              data={[
                useCandlestick
                ? {
                    x: dates,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    type: 'candlestick',
                    name: 'Stock Data',
                  }
                : {
                    x: dates,
                    y: close,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Close Price',
                    line: { color: lineColor },
                    fill: 'tozeroy',
                    fillcolor: (underLineColor),
                  }

              ]}
              layout={{
                margin: {
                  t: 10,  // top margin
                  b: 40,  // bottom margin
                  l: 75,  // left margin
                  r: 40   // right margin
                },
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
                  range: [
                    Math.min(...close) * 0.98,
                    Math.max(...close) * 1.02
                  ]
                
                }    
              }}
              useResizeHandler={true}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: "100vw", height: "80vh" }}
              /> 
            </div>
          : <h2 className='fillerSpace'> </h2>}
          </div>
          : <h2 className='loading'>Loading...</h2>}
      <Footer />
    </>
  );
}

export default StockScreen;