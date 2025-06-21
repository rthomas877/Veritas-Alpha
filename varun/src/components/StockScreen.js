import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import Header from './Header';
import Footer from './Footer';
import LightWeightSB from './LightWeightSB';
import GetGraphData from './GetGraphData';
import Divider from './Divider';
import HeaderSignedIn from './HeaderSignedIn';


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
  const searched = useRef(new URLSearchParams(search).get('q'));

  
  // Extract query parameters
  const query = new URLSearchParams(search).get('q');
  const timeRange = new URLSearchParams(search).get('t') || '3mo';
  
  // Get stock data (now cached and optimized)
  const { 
    dates, open, high, low, close, price, symbol, exchangeName, 
    longName, prevClose, error, loading, timeR, quoteType, total_revenue_yearly,
    time_yearly, total_cogs_yearly, total_gross_profit_yearly,
    total_gross_margin_yearly,
    total_ebit_yearly,
    total_operating_expenses_yearly,
    total_ebit_margin_yearly,
    total_ebitda_yearly,
    total_ebitda_margin_yearly,
    total_pretax_income_yearly,
    total_net_income_yearly,
    total_net_profit_margin_yearly,
    total_diluted_eps_yearly,
    // total_revenue_quarterly,
    // total_cogs_quarterly,
    // total_gross_profit_quarterly,
    // total_gross_margin_quarterly,
    // total_ebit_quarterly,
    // total_operating_expenses_quarterly,
    // total_ebit_margin_quarterly,
    // total_ebitda_quarterly,
    // total_ebitda_margin_quarterly,
    // total_pretax_income_quarterly,
    // total_net_income_quarterly,
    // total_net_profit_margin_quarterly,
    // total_diluted_eps_quarterly,
    // time_quarterly,
    total_working_capital_yearly,
    total_current_ratio_yearly,
    total_quick_ratio_yearly,
    total_cash_ratio_yearly,
    total_solvency_ratio_yearly,
    total_de_ratio_yearly,
    total_capitalization_ratio_yearly,
    total_equity_ratio_yearly,
    total_book_value_share_yearly,
    total_tangible_book_value_share_yearly,
    total_asset_turnover_ratio_yearly,
    total_inventory_turnover_yearly,
    total_total_assets_yearly,
    total_total_liabilities_yearly,
    total_shareholder_equity_yearly,
    // total_working_capital_quarterly,
    // total_current_ratio_quarterly,
    // total_quick_ratio_quarterly,
    // total_cash_ratio_quarterly,
    // total_solvency_ratio_quarterly,
    // total_de_ratio_quarterly,
    // total_capitalization_ratio_quarterly,
    // total_equity_ratio_quarterly,
    // total_book_value_share_quarterly,
    // total_tangible_book_value_share_quarterly,
    // total_asset_turnover_ratio_quarterly,
    // total_inventory_turnover_quarterly,
    // total_total_assets_quarterly,
    // total_total_liabilities_quarterly,
    // total_shareholder_equity_quarterly,
    operating_cash_flow_y,
    free_cash_flow_y,
    fcf_margin_y,
    cashflow_margin_y,
    cashflow_to_net_income_margin_y,
    capEx_ratio_y,
    reinvestment_ratio_y,
    dividend_coverage_y,
    cash_interest_cov_y,
    cash_return_assets_y,
    cash_return_equity_y,
    cash_convert_ratio_y,
    fcf_to_equity_y,
    // operating_cash_flow_q,
    // free_cash_flow_q,
    // fcf_margin_q,
    // cashflow_margin_q,
    // cashflow_to_net_income_margin_q,
    // capEx_ratio_q,
    // reinvestment_ratio_q,
    // dividend_coverage_q,
    // cash_interest_cov_q,
    // cash_return_assets_q,
    // cash_return_equity_q,
    // cash_convert_ratio_q,
    // fcf_to_equity_q,
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

      if (query !== searched.current) {
        searched.current = query;
        setIncomeStatement(true)
        setBalanceSheet(false)
        setCashFlow(false)
        setYearlyData(true)
        setQuarterlyData(false)  
      }

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

  const [incomeStatement, setIncomeStatement] = useState(true);
  const [balanceSheet, setBalanceSheet] = useState(false);
  const [cashFlow, setCashFlow] = useState(false);

  const [yearlyData, setYearlyData] = useState(true);
  const [quarterlyData, setQuarterlyData] = useState(false);

const handleDocTypeI = () => {
  setIncomeStatement(true)
  setBalanceSheet(false)
  setCashFlow(false)
}

const handleDocTypeB = () => {
  setIncomeStatement(false)
  setBalanceSheet(true)
  setCashFlow(false)
}

const handleDocTypeC = () => {
  setIncomeStatement(false)
  setBalanceSheet(false)
  setCashFlow(true)
}

const handleYearly = () => {
  setYearlyData(true)
  setQuarterlyData(false)
}

const handleQuarterly = () => {
  setYearlyData(false)
  setQuarterlyData(true)
}

  const renderDataTypeButtons = () => (
    <div className="timeButtonsData">
      <button
        className={incomeStatement ? 'timeRangeButtonClicked' : 'timeRangeButton'}
        onClick={() => handleDocTypeI(true)}
      >
        Income Statement
      </button>
      <button
        className={balanceSheet ? 'graphTypeButtonClicked' : 'graphTypeButton'}
        onClick={() => handleDocTypeB(true)}
      >
        Balance Sheet
      </button>
      <button
        className={cashFlow ? 'graphTypeButtonClicked' : 'graphTypeButton'}
        onClick={() => handleDocTypeC(true)}
      >
        Cash Flow
      </button>
      <div className="rightButtonsData">
        {/* <button
          className={yearlyData ? 'graphTypeButtonClicked' : 'graphTypeButton'}
          onClick={() => handleYearly(true)}
        >
          Yearly
        </button> */}
        {/* <button
          className={quarterlyData ? 'graphTypeButtonClicked' : 'graphTypeButton'}
          onClick={() => handleQuarterly(false)}
        >
          Quarterly
        </button> */}
      </div>
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
  
  const renderFinancialDataTableIncomeYearly = () => {
    // Sample data - you can replace these with actual data from your API
    const tableData = [
      {
        label: 'Revenue',
        data: total_revenue_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'COGS',
        data: total_cogs_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Gross Profit',
        data: total_gross_profit_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Gross Margin',
        data: total_gross_margin_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
      },
      {
        label: 'Operating Expenses',
        data: total_operating_expenses_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'EBIT',
        data: total_ebit_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'EBIT Margin',
        data: total_ebit_margin_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
      },
      {
        label: 'EBITDA',
        data: total_ebitda_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'EBITDA Margin',
        data: total_ebitda_margin_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
      },
      {
        label: 'Pre-Tax Income', // Replace with actual metric name
        data: total_pretax_income_yearly, // Replace with actual data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Net Income', // Replace with actual metric name
        data: total_net_income_yearly, // Replace with actual data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Net Profit Margin', // Replace with actual metric name
        data: total_net_profit_margin_yearly, // Replace with actual data
        formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
      },
      {
        label: 'Net EPS (Diluted)', // Replace with actual metric name
        data: total_diluted_eps_yearly, // Replace with actual data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
    ];
  
    return (
      <div>
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
      </div>
    );
  };

  const renderFinancialDataTableCashFlowYearly = () => {
    // Sample data - you can replace these with actual data from your API
    const tableData = [
      {
        label: 'Operating Cash Flow',
        data: operating_cash_flow_y,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Free Cash Flow',
        data: free_cash_flow_y,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'FCF Margin',
        data: fcf_margin_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Flow Margin', // Replace with actual metric name
        data: cashflow_margin_y, // Replace with actual data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Flow to Net Income',
        data: cashflow_to_net_income_margin_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'CapEx Ratio',
        data: capEx_ratio_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Reinvestment Ratio',
        data: reinvestment_ratio_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Dividend Coverage (Cash)',
        data: dividend_coverage_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Interest Coverage',
        data: cash_interest_cov_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Return on Assets',
        data: cash_return_assets_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Return on Equity',
        data: cash_return_equity_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Conversion Ratio',
        data: cash_convert_ratio_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Free Cash Flow to Equity',
        data: fcf_to_equity_y, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
    ];
  
    return (
      <>
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
      </>
    );
  };

  const renderFinancialDataTableBalanceSheetYearly = () => {
    // Sample data - you can replace these with actual data from your API
    const tableData = [
      {
        label: 'Working Capital',
        data: total_working_capital_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Total Assets',
        data: total_total_assets_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Total Liabilities',
        data: total_total_liabilities_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Total Equity',
        data: total_shareholder_equity_yearly,
        formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
      },
      {
        label: 'Current Ratio',
        data: total_current_ratio_yearly,
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Quick Ratio',
        data: total_quick_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Cash Ratio', // Replace with actual metric name
        data: total_cash_ratio_yearly, // Replace with actual data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Solvency Ratio',
        data: total_solvency_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'D/E Ratio',
        data: total_de_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Capitalization Ratio',
        data: total_capitalization_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Equity Ratio',
        data: total_equity_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Book Value / Share',
        data: total_book_value_share_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Tangible Book Value / Share',
        data: total_tangible_book_value_share_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Asset Turnover Ratio',
        data: total_asset_turnover_ratio_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
      {
        label: 'Inventory Turnover',
        data: total_inventory_turnover_yearly, // Replace with actual profit data
        formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
      },
    ];
  
    return (
      <>
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
      </>
    );
  };

  // const renderFinancialDataTableIncomeQuarterly = () => {
  //   // Sample data - you can replace these with actual data from your API
  //   const tableData = [
  //     {
  //       label: 'Revenue',
  //       data: total_revenue_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'COGS',
  //       data: total_cogs_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Gross Profit',
  //       data: total_gross_profit_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Gross Margin',
  //       data: total_gross_margin_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
  //     },
  //     {
  //       label: 'Operating Expenses',
  //       data: total_operating_expenses_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'EBIT',
  //       data: total_ebit_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'EBIT Margin',
  //       data: total_ebit_margin_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
  //     },
  //     {
  //       label: 'EBITDA',
  //       data: total_ebitda_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'EBITDA Margin',
  //       data: total_ebitda_margin_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
  //     },
  //     {
  //       label: 'Pre-Tax Income',
  //       data: total_pretax_income_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Net Income',
  //       data: total_net_income_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Net Profit Margin',
  //       data: total_net_profit_margin_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
  //     },
  //     {
  //       label: 'Net EPS (Diluted)',
  //       data: total_diluted_eps_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //   ];
  
  //   return (
  //     <div>
  //       <table className='stockDataTable'>
  //         <thead>
  //           <tr>
  //             <th className='topOfTable'>Quarter</th>
  //             <th className='topOfTable'>{time_quarterly[3]}</th>
  //             <th className='topOfTable'>{time_quarterly[2]}</th>
  //             <th className='topOfTable'>{time_quarterly[1]}</th>
  //             <th className='topOfTable'>{time_quarterly[0]}</th>
  //             <th className='tableCell'>4-Quarter Trend</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {tableData.map((row, index) => (
  //             <tr key={index}>
  //               <th className='leftsideTable'>{row.label}</th>
  //               <td>{row.formatValue(row.data[3])}</td>
  //               <td>{row.formatValue(row.data[2])}</td>
  //               <td>{row.formatValue(row.data[1])}</td>
  //               <td>{row.formatValue(row.data[0])}</td>
  //               <td className='tableCell'>{renderDataChart(row.data)}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

  // const renderFinancialDataTableCashFlowQuarterly = () => {
  //   // Sample data - you can replace these with actual data from your API
  //   const tableData = [
  //     {
  //       label: 'Operating Cash Flow',
  //       data: operating_cash_flow_q,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Free Cash Flow',
  //       data: free_cash_flow_q,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'FCF Margin',
  //       data: fcf_margin_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Flow Margin', // Replace with actual metric name
  //       data: cashflow_margin_q, // Replace with actual data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Flow to Net Income',
  //       data: cashflow_to_net_income_margin_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'CapEx Ratio',
  //       data: capEx_ratio_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Reinvestment Ratio',
  //       data: reinvestment_ratio_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Dividend Coverage (Cash)',
  //       data: dividend_coverage_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Interest Coverage',
  //       data: cash_interest_cov_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Return on Assets',
  //       data: cash_return_assets_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Return on Equity',
  //       data: cash_return_equity_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Conversion Ratio',
  //       data: cash_convert_ratio_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Free Cash Flow to Equity',
  //       data: fcf_to_equity_q, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //   ];
  
  //   return (
  //     <>
  //       <table className='stockDataTable'>
  //         <thead>
  //           <tr>
  //             <th className='topOfTable'>Quarter</th>
  //             <th className='topOfTable'>{time_quarterly[3]}</th>
  //             <th className='topOfTable'>{time_quarterly[2]}</th>
  //             <th className='topOfTable'>{time_quarterly[1]}</th>
  //             <th className='topOfTable'>{time_quarterly[0]}</th>
  //             <th className='tableCell'>4-Year Trend</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {tableData.map((row, index) => (
  //             <tr key={index}>
  //               <th className='leftsideTable'>{row.label}</th>
  //               <td>{row.formatValue(row.data[3])}</td>
  //               <td>{row.formatValue(row.data[2])}</td>
  //               <td>{row.formatValue(row.data[1])}</td>
  //               <td>{row.formatValue(row.data[0])}</td>
  //               <td className='tableCell'>{renderDataChart(row.data)}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </>
  //   );
  // };

  // const renderFinancialDataTableBalanceSheetQuarterly = () => {
  //   // Sample data - you can replace these with actual data from your API
  //   const tableData = [
  //     {
  //       label: 'Working Capital',
  //       data: total_working_capital_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Total Assets',
  //       data: total_total_assets_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Total Liabilities',
  //       data: total_total_liabilities_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Total Equity',
  //       data: total_shareholder_equity_quarterly,
  //       formatValue: (value) => Number.isFinite(value / dataDivider) ? Math.round(value / dataDivider).toLocaleString() : '-'
  //     },
  //     {
  //       label: 'Current Ratio',
  //       data: total_current_ratio_quarterly,
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Quick Ratio',
  //       data: total_quick_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Cash Ratio', // Replace with actual metric name
  //       data: total_cash_ratio_quarterly, // Replace with actual data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Solvency Ratio',
  //       data: total_solvency_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'D/E Ratio',
  //       data: total_de_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Capitalization Ratio',
  //       data: total_capitalization_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Equity Ratio',
  //       data: total_equity_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Book Value / Share',
  //       data: total_book_value_share_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Tangible Book Value / Share',
  //       data: total_tangible_book_value_share_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Asset Turnover Ratio',
  //       data: total_asset_turnover_ratio_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //     {
  //       label: 'Inventory Turnover',
  //       data: total_inventory_turnover_quarterly, // Replace with actual profit data
  //       formatValue: (value) => Number.isFinite(value) ? value.toFixed(2) : '-'
  //     },
  //   ];
  
  //   return (
  //     <>
  //       <table className='stockDataTable'>
  //         <thead>
  //           <tr>
  //             <th className='topOfTable'>Quarter</th>
  //             <th className='topOfTable'>{time_quarterly[3]}</th>
  //             <th className='topOfTable'>{time_quarterly[2]}</th>
  //             <th className='topOfTable'>{time_quarterly[1]}</th>
  //             <th className='topOfTable'>{time_quarterly[0]}</th>
  //             <th className='tableCell'>4-Year Trend</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {tableData.map((row, index) => (
  //             <tr key={index}>
  //               <th className='leftsideTable'>{row.label}</th>
  //               <td>{row.formatValue(row.data[3])}</td>
  //               <td>{row.formatValue(row.data[2])}</td>
  //               <td>{row.formatValue(row.data[1])}</td>
  //               <td>{row.formatValue(row.data[0])}</td>
  //               <td className='tableCell'>{renderDataChart(row.data)}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </>
  //   );
  // };

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
      {localStorage.getItem('token') ? <HeaderSignedIn /> : <Header />}
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
            <div className='faqList'>
              <h2 className="FAQTitle1">
                Financial Data for {longName}
                {/* <img src='VA AI Logo.svg' className='AILogo' alt=''></img> */}
              </h2>
              <hr />
              <h2 className='clarify'>*Values in USD {dataDividerVerbose}</h2>
              {renderDataTypeButtons()}
              {incomeStatement && yearlyData && (
                <div>
                  {renderFinancialDataTableIncomeYearly()}
                </div>
              )}
              {balanceSheet && yearlyData && (
                <div>
                  {renderFinancialDataTableBalanceSheetYearly()}
                </div>
              )}
              {cashFlow && yearlyData && (
                <div>
                  {renderFinancialDataTableCashFlowYearly()}
                </div>
              )}
              {/* {incomeStatement && quarterlyData && (
                <div>
                  {renderFinancialDataTableIncomeQuarterly()}
                </div>
              )}
              {balanceSheet && quarterlyData && (
                <div>
                  {renderFinancialDataTableBalanceSheetQuarterly()}
                </div>
              )}
              {cashFlow && quarterlyData && (
                <div>
                  {renderFinancialDataTableCashFlowQuarterly()}
                </div>
              )} */}
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default StockScreen;