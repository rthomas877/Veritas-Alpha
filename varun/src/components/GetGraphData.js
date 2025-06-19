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
  const [quoteType, setQuoteType] = useState("");
  const [total_revenue_yearly, setTotal_revenue_yearly] = useState([]);
  const [total_cogs_yearly, setTotal_cogs_yearly] = useState([])
  const [total_gross_profit_yearly, setTotal_gross_profit_yearly] = useState([]);
  const [total_gross_margin_yearly, setTotal_gross_margin_yearly] = useState([]);
  const [total_ebit_yearly, setTotal_ebit_yearly] = useState([]);
  const [total_operating_expenses_yearly, setTotal_operating_expenses_yearly] = useState([]);
  const [total_ebit_margin_yearly, setTotal_ebit_margin_yearly] = useState([]);
  const [total_ebitda_yearly, setTotal_ebitda_yearly] = useState([]);
  const [total_ebitda_margin_yearly, setTotal_ebitda_margin_yearly] = useState([]);
  const [total_pretax_income_yearly, setTotal_pretax_income_yearly] = useState([]);
  const [total_tax_provision_yearly, setTotal_tax_provision_yearly] = useState([]);
  const [total_net_income_yearly, setTotal_net_income_yearly] = useState([]);
  const [total_net_profit_margin_yearly, setTotal_net_profit_margin_yearly] = useState([]);
  const [total_diluted_eps_yearly, setTotal_diluted_eps_yearly] = useState([]);
  const [time_yearly, setTime_yearly] = useState([]);
  const [total_revenue_quarterly, setTotal_revenue_quarterly] = useState([]);
  const [total_cogs_quarterly, setTotal_cogs_quarterly] = useState([])
  const [total_gross_profit_quarterly, setTotal_gross_profit_quarterly] = useState([]);
  const [total_gross_margin_quarterly, setTotal_gross_margin_quarterly] = useState([]);
  const [total_ebit_quarterly, setTotal_ebit_quarterly] = useState([]);
  const [total_operating_expenses_quarterly, setTotal_operating_expenses_quarterly] = useState([]);
  const [total_ebit_margin_quarterly, setTotal_ebit_margin_quarterly] = useState([]);
  const [total_ebitda_quarterly, setTotal_ebitda_quarterly] = useState([]);
  const [total_ebitda_margin_quarterly, setTotal_ebitda_margin_quarterly] = useState([]);
  const [total_pretax_income_quarterly, setTotal_pretax_income_quarterly] = useState([]);
  const [total_tax_provision_quarterly, setTotal_tax_provision_quarterly] = useState([]);
  const [total_net_income_quarterly, setTotal_net_income_quarterly] = useState([]);
  const [total_net_profit_margin_quarterly, setTotal_net_profit_margin_quarterly] = useState([]);
  const [total_diluted_eps_quarterly, setTotal_diluted_eps_quarterly] = useState([]);
  const [time_quarterly, setTime_quarterly] = useState([]);
  const [total_working_capital_yearly, setTotal_working_capital_yearly] = useState([]);
  const [total_current_ratio_yearly, setTotal_current_ratio_yearly] = useState([]);
  const [total_quick_ratio_yearly, setTotal_quick_ratio_yearly] = useState([]);
  const [total_cash_ratio_yearly, setTotal_cash_ratio_yearly] = useState([]);
  const [total_solvency_ratio_yearly, setTotal_solvency_ratio_yearly] = useState([]);
  const [total_de_ratio_yearly, setTotal_de_ratio_yearly] = useState([]);
  const [total_capitalization_ratio_yearly, setTotal_capitalization_ratio_yearly] = useState([]);
  const [total_equity_ratio_yearly, setTotal_equity_ratio_yearly] = useState([]);
  const [total_book_value_share_yearly, setTotal_book_value_share_yearly] = useState([]);
  const [total_tangible_book_value_share_yearly, setTotal_tangible_book_value_share_yearly] = useState([]);
  const [total_asset_turnover_ratio_yearly, setTotal_asset_turnover_ratio_yearly] = useState([]);
  const [total_inventory_turnover_yearly, setTotal_inventory_turnover_yearly] = useState([]);
  const [total_total_liabilities_yearly, setTotal_total_liabilities_yearly] = useState([]);
  const [total_total_assets_yearly, setTotal_total_assets_yearly] = useState([]);
  const [total_shareholder_equity_yearly, setTotal_shareholder_equity_yearly] = useState([]);
  const [total_working_capital_quarterly, setTotal_working_capital_quarterly] = useState([]);
  const [total_current_ratio_quarterly, setTotal_current_ratio_quarterly] = useState([]);
  const [total_quick_ratio_quarterly, setTotal_quick_ratio_quarterly] = useState([]);
  const [total_cash_ratio_quarterly, setTotal_cash_ratio_quarterly] = useState([]);
  const [total_solvency_ratio_quarterly, setTotal_solvency_ratio_quarterly] = useState([]);
  const [total_de_ratio_quarterly, setTotal_de_ratio_quarterly] = useState([]);
  const [total_capitalization_ratio_quarterly, setTotal_capitalization_ratio_quarterly] = useState([]);
  const [total_equity_ratio_quarterly, setTotal_equity_ratio_quarterly] = useState([]);
  const [total_book_value_share_quarterly, setTotal_book_value_share_quarterly] = useState([]);
  const [total_tangible_book_value_share_quarterly, setTotal_tangible_book_value_share_quarterly] = useState([]);
  const [total_asset_turnover_ratio_quarterly, setTotal_asset_turnover_ratio_quarterly] = useState([]);
  const [total_inventory_turnover_quarterly, setTotal_inventory_turnover_quarterly] = useState([]);
  const [total_total_liabilities_quarterly, setTotal_total_liabilities_quarterly] = useState([]);
  const [total_total_assets_quarterly, setTotal_total_assets_quarterly] = useState([]);
  const [total_shareholder_equity_quarterly, setTotal_shareholder_equity_quarterly] = useState([]);
  const [operating_cash_flow_y, setOperating_cash_flow_y] = useState([]);
  const [free_cash_flow_y, setFree_cash_flow_y] = useState([]);
  const [fcf_margin_y, setFcf_margin_y] = useState([]);
  const [cashflow_margin_y, setCashflow_margin_y] = useState([]);
  const [cashflow_to_net_income_margin_y, setCashflow_to_net_income_margin_y] = useState([]);
  const [capEx_ratio_y, setCapEx_ratio_y] = useState([]);
  const [reinvestment_ratio_y, setReinvestment_ratio_y] = useState([]);
  const [dividend_coverage_y, setDividend_coverage_y] = useState([]);
  const [cash_interest_cov_y, setCash_interest_cov_y] = useState([]);
  const [cash_return_assets_y, setCash_return_assets_y] = useState([]);
  const [cash_return_equity_y, setCash_return_equity_y] = useState([]);
  const [cash_convert_ratio_y, setCash_convert_ratio_y] = useState([]);
  const [fcf_to_equity_y, setFcf_to_equity_y] = useState([]);
  const [operating_cash_flow_q, setOperating_cash_flow_q] = useState([]);
  const [free_cash_flow_q, setFree_cash_flow_q] = useState([]);
  const [fcf_margin_q, setFcf_margin_q] = useState([]);
  const [cashflow_margin_q, setCashflow_margin_q] = useState([]);
  const [cashflow_to_net_income_margin_q, setCashflow_to_net_income_margin_q] = useState([]);
  const [capEx_ratio_q, setCapEx_ratio_q] = useState([]);
  const [reinvestment_ratio_q, setReinvestment_ratio_q] = useState([]);
  const [dividend_coverage_q, setDividend_coverage_q] = useState([]);
  const [cash_interest_cov_q, setCash_interest_cov_q] = useState([]);
  const [cash_return_assets_q, setCash_return_assets_q] = useState([]);
  const [cash_return_equity_q, setCash_return_equity_q] = useState([]);
  const [cash_convert_ratio_q, setCash_convert_ratio_q] = useState([]);
  const [fcf_to_equity_q, setFcf_to_equity_q] = useState([]);




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
      setQuoteType(allData.quoteType || "N/A")
      setTotal_revenue_yearly(allData.total_revenue_yearly || []);
      setTotal_cogs_yearly(allData.total_cogs_yearly || []);
      setTotal_gross_profit_yearly(allData.total_gross_profit_yearly || []);
      setTotal_gross_margin_yearly(allData.total_gross_margin_yearly || []);
      setTotal_ebit_yearly(allData.total_ebit_yearly || []);
      setTotal_operating_expenses_yearly(allData.total_operating_expenses_yearly || []);
      setTotal_ebit_margin_yearly(allData.total_ebit_margin_yearly || []);
      setTotal_ebitda_yearly(allData.total_ebitda_yearly || []);
      setTotal_ebitda_margin_yearly(allData.total_ebitda_margin_yearly || []);
      setTotal_pretax_income_yearly(allData.total_pretax_income_yearly || []);
      setTotal_tax_provision_yearly(allData.total_tax_provision_yearly || []);
      setTotal_net_income_yearly(allData.total_net_income_yearly || []);
      setTotal_net_profit_margin_yearly(allData.total_net_profit_margin_yearly || []);
      setTotal_diluted_eps_yearly(allData.total_diluted_eps_yearly || []);
      setTime_yearly(allData.time_yearly || []);
      setTotal_revenue_quarterly(allData.total_revenue_quarterly || []);
      setTotal_cogs_quarterly(allData.total_cogs_quarterly || []);
      setTotal_gross_profit_quarterly(allData.total_gross_profit_quarterly || []);
      setTotal_gross_margin_quarterly(allData.total_gross_margin_quarterly || []);
      setTotal_ebit_quarterly(allData.total_ebit_quarterly || []);
      setTotal_operating_expenses_quarterly(allData.total_operating_expenses_quarterly || []);
      setTotal_ebit_margin_quarterly(allData.total_ebit_margin_quarterly || []);
      setTotal_ebitda_quarterly(allData.total_ebitda_quarterly || []);
      setTotal_ebitda_margin_quarterly(allData.total_ebitda_margin_quarterly || []);
      setTotal_pretax_income_quarterly(allData.total_pretax_income_quarterly || []);
      setTotal_tax_provision_quarterly(allData.total_tax_provision_quarterly || []);
      setTotal_net_income_quarterly(allData.total_net_income_quarterly || []);
      setTotal_net_profit_margin_quarterly(allData.total_net_profit_margin_quarterly || []);
      setTotal_diluted_eps_quarterly(allData.total_diluted_eps_quarterly || []);
      setTime_quarterly(allData.time_quarterly || []);
      setTotal_working_capital_yearly(allData.total_working_capital_yearly || []);
      setTotal_current_ratio_yearly(allData.total_current_ratio_yearly || []);
      setTotal_quick_ratio_yearly(allData.total_quick_ratio_yearly || []);
      setTotal_cash_ratio_yearly(allData.total_cash_ratio_yearly || []);
      setTotal_solvency_ratio_yearly(allData.total_solvency_ratio_yearly || []);
      setTotal_de_ratio_yearly(allData.total_de_ratio_yearly || []);
      setTotal_capitalization_ratio_yearly(allData.total_capitalization_ratio_yearly || []);
      setTotal_equity_ratio_yearly(allData.total_equity_ratio_yearly || []);
      setTotal_book_value_share_yearly(allData.total_book_value_share_yearly || []);
      setTotal_tangible_book_value_share_yearly(allData.total_tangible_book_value_share_yearly || []);
      setTotal_asset_turnover_ratio_yearly(allData.total_asset_turnover_ratio_yearly || []);
      setTotal_inventory_turnover_yearly(allData.total_inventory_turnover_yearly || []);
      setTotal_total_assets_yearly(allData.total_total_assets_yearly || []);
      setTotal_total_liabilities_yearly(allData.total_total_liabilities_yearly || []);
      setTotal_shareholder_equity_yearly(allData.total_shareholder_equity_yearly || []);
      setTotal_working_capital_quarterly(allData.total_working_capital_quarterly || []);
      setTotal_current_ratio_quarterly(allData.total_current_ratio_quarterly || []);
      setTotal_quick_ratio_quarterly(allData.total_quick_ratio_quarterly || []);
      setTotal_cash_ratio_quarterly(allData.total_cash_ratio_quarterly || []);
      setTotal_solvency_ratio_quarterly(allData.total_solvency_ratio_quarterly || []);
      setTotal_de_ratio_quarterly(allData.total_de_ratio_quarterly || []);
      setTotal_capitalization_ratio_quarterly(allData.total_capitalization_ratio_quarterly || []);
      setTotal_equity_ratio_quarterly(allData.total_equity_ratio_quarterly || []);
      setTotal_book_value_share_quarterly(allData.total_book_value_share_quarterly || []);
      setTotal_tangible_book_value_share_quarterly(allData.total_tangible_book_value_share_quarterly || []);
      setTotal_asset_turnover_ratio_quarterly(allData.total_asset_turnover_ratio_quarterly || []);
      setTotal_inventory_turnover_quarterly(allData.total_inventory_turnover_quarterly || []);
      setTotal_total_assets_quarterly(allData.total_total_assets_quarterly || []);
      setTotal_total_liabilities_quarterly(allData.total_total_liabilities_quarterly || []);
      setTotal_shareholder_equity_quarterly(allData.total_shareholder_equity_quarterly || []);
      setOperating_cash_flow_y(allData.operating_cash_flow_y || []);
      setFree_cash_flow_y(allData.free_cash_flow_y || []);
      setFcf_margin_y(allData.fcf_margin_y || []);
      setCashflow_margin_y(allData.cashflow_margin_y || []);
      setCashflow_to_net_income_margin_y(allData.cashflow_to_net_income_margin_y || []);
      setCapEx_ratio_y(allData.capEx_ratio_y || []);
      setReinvestment_ratio_y(allData.reinvestment_ratio_y || []);
      setDividend_coverage_y(allData.dividend_coverage_y || []);
      setCash_interest_cov_y(allData.cash_interest_cov_y || []);
      setCash_return_assets_y(allData.cash_return_assets_y || []);
      setCash_return_equity_y(allData.cash_return_equity_y || []);
      setCash_convert_ratio_y(allData.cash_convert_ratio_y || []);
      setFcf_to_equity_y(allData.fcf_to_equity_y || []);
      setOperating_cash_flow_q(allData.operating_cash_flow_q || []);
      setFree_cash_flow_q(allData.free_cash_flow_q || []);
      setFcf_margin_q(allData.fcf_margin_q || []);
      setCashflow_margin_q(allData.cashflow_margin_q || []);
      setCashflow_to_net_income_margin_q(allData.cashflow_to_net_income_margin_q || []);
      setCapEx_ratio_q(allData.capEx_ratio_q || []);
      setReinvestment_ratio_q(allData.reinvestment_ratio_q || []);
      setDividend_coverage_q(allData.dividend_coverage_q || []);
      setCash_interest_cov_q(allData.cash_interest_cov_q || []);
      setCash_return_assets_q(allData.cash_return_assets_q || []);
      setCash_return_equity_q(allData.cash_return_equity_q || []);
      setCash_convert_ratio_q(allData.cash_convert_ratio_q || []);
      setFcf_to_equity_q(allData.fcf_to_equity_q || []);
    } else {
      // Fallback to empty arrays if time range not available
      setDates([]);
      setOpen([]);
      setHigh([]);
      setLow([]);
      setClose([]);
      setPrevClose(null);
      setTimeR(selectedTime);
      setQuoteType("");
      setTotal_revenue_yearly([]);
      setTotal_cogs_yearly([]);
      setTotal_gross_profit_yearly([]);
      setTotal_gross_margin_yearly([]);
      setTotal_ebit_yearly([]);
      setTotal_operating_expenses_yearly([]);
      setTotal_ebit_margin_yearly([]);
      setTotal_ebitda_yearly([]);
      setTotal_ebitda_margin_yearly([]);
      setTotal_pretax_income_yearly([]);
      setTotal_tax_provision_yearly([]);
      setTotal_net_income_yearly([]);
      setTotal_net_profit_margin_yearly([]);
      setTotal_diluted_eps_yearly([]);
      setTime_yearly([]);
      setTotal_revenue_quarterly([]);
      setTotal_cogs_quarterly([]);
      setTotal_gross_profit_quarterly([]);
      setTotal_gross_margin_quarterly([]);
      setTotal_ebit_quarterly([]);
      setTotal_operating_expenses_quarterly([]);
      setTotal_ebit_margin_quarterly([]);
      setTotal_ebitda_quarterly([]);
      setTotal_ebitda_margin_quarterly([]);
      setTotal_pretax_income_quarterly([]);
      setTotal_tax_provision_quarterly([]);
      setTotal_net_income_quarterly([]);
      setTotal_net_profit_margin_quarterly([]);
      setTotal_diluted_eps_quarterly([]);
      setTime_quarterly([]);
      setTotal_working_capital_yearly([]);
      setTotal_current_ratio_yearly([]);
      setTotal_quick_ratio_yearly([]);
      setTotal_cash_ratio_yearly([]);
      setTotal_solvency_ratio_yearly([]);
      setTotal_de_ratio_yearly([]);
      setTotal_capitalization_ratio_yearly([]);
      setTotal_equity_ratio_yearly([]);
      setTotal_book_value_share_yearly([]);
      setTotal_tangible_book_value_share_yearly([]);
      setTotal_asset_turnover_ratio_yearly([]);
      setTotal_inventory_turnover_yearly([]);
      setTotal_total_assets_yearly([]);
      setTotal_total_liabilities_yearly([]);
      setTotal_shareholder_equity_yearly([]);
      setTotal_working_capital_quarterly([]);
      setTotal_current_ratio_quarterly([]);
      setTotal_quick_ratio_quarterly([]);
      setTotal_cash_ratio_quarterly([]);
      setTotal_solvency_ratio_quarterly([]);
      setTotal_de_ratio_quarterly([]);
      setTotal_capitalization_ratio_quarterly([]);
      setTotal_equity_ratio_quarterly([]);
      setTotal_book_value_share_quarterly([]);
      setTotal_tangible_book_value_share_quarterly([]);
      setTotal_asset_turnover_ratio_quarterly([]);
      setTotal_inventory_turnover_quarterly([]);
      setTotal_total_assets_quarterly([]);
      setTotal_total_liabilities_quarterly([]);
      setTotal_shareholder_equity_quarterly([]);
      setOperating_cash_flow_y([]);
      setFree_cash_flow_y([]);
      setFcf_margin_y([]);
      setCashflow_margin_y([]);
      setCashflow_to_net_income_margin_y([]);
      setCapEx_ratio_y([]);
      setReinvestment_ratio_y([]);
      setDividend_coverage_y([]);
      setCash_interest_cov_y([]);
      setCash_return_assets_y([]);
      setCash_return_equity_y([]);
      setCash_convert_ratio_y([]);
      setFcf_to_equity_y([]);
      setOperating_cash_flow_q([]);
      setFree_cash_flow_q([]);
      setFcf_margin_q([]);
      setCashflow_margin_q([]);
      setCashflow_to_net_income_margin_q([]);
      setCapEx_ratio_q([]);
      setReinvestment_ratio_q([]);
      setDividend_coverage_q([]);
      setCash_interest_cov_q([]);
      setCash_return_assets_q([]);
      setCash_return_equity_q([]);
      setCash_convert_ratio_q([]);
      setFcf_to_equity_q([]);
    }
    
    setPrice(allData.price || null);
    setSymbol(allData.symbol || '');
    setExchangeName(allData.exchangeName || '');
    setLongName(allData.longName || '');
    setError(null);
    setQuoteType(allData.quoteType || "N/A")
  };

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    const normalizedTicker = ticker.toUpperCase();
    const selectedTime = time || '3mo';

    // If we have cached data for this symbol, use it
    if (allDataCache.current[normalizedTicker]) { // checks if ticker is in cached data
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
    timeR, 
    quoteType,
    total_revenue_yearly,
    total_cogs_yearly,
    total_gross_profit_yearly,
    total_gross_margin_yearly,
    total_ebit_yearly,
    total_operating_expenses_yearly,
    total_ebit_margin_yearly,
    total_ebitda_yearly,
    total_ebitda_margin_yearly,
    total_pretax_income_yearly,
    total_tax_provision_yearly,
    total_net_income_yearly,
    total_net_profit_margin_yearly,
    total_diluted_eps_yearly,
    time_yearly,
    total_revenue_quarterly,
    total_cogs_quarterly,
    total_gross_profit_quarterly,
    total_gross_margin_quarterly,
    total_ebit_quarterly,
    total_operating_expenses_quarterly,
    total_ebit_margin_quarterly,
    total_ebitda_quarterly,
    total_ebitda_margin_quarterly,
    total_pretax_income_quarterly,
    total_tax_provision_quarterly,
    total_net_income_quarterly,
    total_net_profit_margin_quarterly,
    total_diluted_eps_quarterly,
    time_quarterly,
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
    total_working_capital_quarterly,
    total_current_ratio_quarterly,
    total_quick_ratio_quarterly,
    total_cash_ratio_quarterly,
    total_solvency_ratio_quarterly,
    total_de_ratio_quarterly,
    total_capitalization_ratio_quarterly,
    total_equity_ratio_quarterly,
    total_book_value_share_quarterly,
    total_tangible_book_value_share_quarterly,
    total_asset_turnover_ratio_quarterly,
    total_inventory_turnover_quarterly,
    total_total_assets_quarterly,
    total_total_liabilities_quarterly,
    total_shareholder_equity_quarterly,
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
    operating_cash_flow_q,
    free_cash_flow_q,
    fcf_margin_q,
    cashflow_margin_q,
    cashflow_to_net_income_margin_q,
    capEx_ratio_q,
    reinvestment_ratio_q,
    dividend_coverage_q,
    cash_interest_cov_q,
    cash_return_assets_q,
    cash_return_equity_q,
    cash_convert_ratio_q,
    fcf_to_equity_q,
  };
}

export default GetGraphData;