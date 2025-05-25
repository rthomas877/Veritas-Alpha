import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import LightWeightSB from './LightWeightSB';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import GetGraphData from './GetGraphData';
import { useState } from 'react';

function StockScreen() {    

  const { search } = useLocation(); // need to use search, it's a special value returned by useLocation
  const query = new URLSearchParams(search).get('q');

  const { dates, open, high, low, close, price, symbol, exchangeName, longName, prevClose, error, loading } = GetGraphData({ ticker: query });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      document.title = error === null
        ? "Veritas Alpha | " + longName
        : "Veritas Alpha | No Results";
        setShowContent(true);

    }
  }, [error, longName, loading]);

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
              today
            </>
          ) : (
            ""
          )}   
          </h2>
        {error === null ?
        <div>
          <Plot className='stockGraph'
            data={[
              {
                x: dates,
                open: open,
                high: high,
                low: low,
                close: close,
                type: 'candlestick',
                name: 'Stock Data',
              },
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
                fixedrange: true
              }    
            }}
            useResizeHandler={true}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100vw", height: "85vh" }}
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