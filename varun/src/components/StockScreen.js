import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import LightWeightSB from './LightWeightSB';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import GetGraphData from './GetGraphData';

function StockScreen() {    

  const { search } = useLocation(); // need to use search, it's a special value returned by useLocation
  const query = new URLSearchParams(search).get('q');

  const { dates, open, high, low, close, price, symbol, exchangeName, longName } = GetGraphData({ ticker: query });

  useEffect(() => {
    document.title = "Veritas Alpha | TESTPAGE";
  }, []);

  return (
    <> 
      <Header />
      <LightWeightSB />
      <h2 className='stockTitle'>{longName} ({symbol}:{exchangeName}) - ${price !== null ? price.toLocaleString() : "N/A"}</h2>
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
                  autosize: true,
                  paper_bgcolor: '#f5f5dc',  
                  plot_bgcolor: '#f5f5dc', 
                  xaxis: {
                    rangeslider: { visible: false },
                    type: 'category',
                  },
                                     
                  
        }}
        useResizeHandler={true}
        config={{ displayModeBar: 'never' }}
        style={{ width: "100vw", height: "85vh" }}
        />
      <Footer />
    </>
  );
}

export default StockScreen;