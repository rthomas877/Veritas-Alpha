from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import requests_cache
import datetime
import pandas as pd
import math


# Cache setup: cache lasts 20 minutes
requests_cache.install_cache('yfinance_cache', expire_after=1200)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

def get_all_time_data(ticker):
    """Get all available historical data for a stock symbol"""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Get different time periods with appropriate intervals
        data_sets = {}
        
        # 1 day - 1 minute intervals
        hist_1d = stock.history(period="1d", interval="1m")
        if not hist_1d.empty:
            data_sets['1d'] = {
                'dates': hist_1d.index.strftime('%I:%M %p').tolist(),
                'open': hist_1d['Open'].tolist(),
                'high': hist_1d['High'].tolist(),
                'low': hist_1d['Low'].tolist(),
                'close': hist_1d['Close'].tolist(),
                'prevClose': info.get("previousClose", None)
            }
        
        # 5 days - 15 minute intervals
        hist_5d = stock.history(period="5d", interval="15m")
        if not hist_5d.empty:
            data_sets['5d'] = {
                'dates': hist_5d.index.strftime('%B %d, %Y %I:%M %p').tolist(),
                'open': hist_5d['Open'].tolist(),
                'high': hist_5d['High'].tolist(),
                'low': hist_5d['Low'].tolist(),
                'close': hist_5d['Close'].tolist(),
                'prevClose': hist_5d.iloc[0]["Open"]
            }
        
        # Get maximum historical data (daily intervals)
        hist_max = stock.history(period="max")
        if not hist_max.empty:
            dates_formatted = hist_max.index.strftime('%B %d, %Y').tolist()
            open_vals = hist_max['Open'].tolist()
            high_vals = hist_max['High'].tolist()
            low_vals = hist_max['Low'].tolist()
            close_vals = hist_max['Close'].tolist()
            
            # Calculate data points for different time ranges from max data
            now = pd.Timestamp.now(tz=hist_max.index.tz)

            
            # Helper function to filter data by date range
            def filter_by_days(days):
                cutoff_date = now - datetime.timedelta(days=days)
                mask = hist_max.index >= cutoff_date
                filtered_data = hist_max[mask]
                if filtered_data.empty:
                    return None
                return {
                    'dates': filtered_data.index.strftime('%B %d, %Y').tolist(),
                    'open': filtered_data['Open'].tolist(),
                    'high': filtered_data['High'].tolist(),
                    'low': filtered_data['Low'].tolist(),
                    'close': filtered_data['Close'].tolist(),
                    'prevClose': filtered_data.iloc[0]["Open"] if len(filtered_data) > 0 else None
                }
            
            # Helper function for year-to-date
            def filter_ytd():
                current_year = now.year
                # Make the start of year datetime timezone-aware with the same tz as the data index
                ytd_start = pd.Timestamp(datetime.datetime(current_year, 1, 1), tz=hist_max.index.tz)
                mask = hist_max.index >= ytd_start
                filtered_data = hist_max[mask]
                if filtered_data.empty:
                    return None
                return {
                    'dates': filtered_data.index.strftime('%B %d, %Y').tolist(),
                    'open': filtered_data['Open'].tolist(),
                    'high': filtered_data['High'].tolist(),
                    'low': filtered_data['Low'].tolist(),
                    'close': filtered_data['Close'].tolist(),
                    'prevClose': filtered_data.iloc[0]["Open"] if len(filtered_data) > 0 else None
                }

            
            # 1 month
            month_data = filter_by_days(30)
            if month_data:
                data_sets['1mo'] = month_data
            
            # 3 months
            three_month_data = filter_by_days(90)
            if three_month_data:
                data_sets['3mo'] = three_month_data
            
            # 6 months
            six_month_data = filter_by_days(180)
            if six_month_data:
                data_sets['6mo'] = six_month_data
            
            # Year to date
            ytd_data = filter_ytd()
            if ytd_data:
                data_sets['ytd'] = ytd_data
            
            # 1 year
            one_year_data = filter_by_days(365)
            if one_year_data:
                data_sets['1y'] = one_year_data
            
            # 5 years
            five_year_data = filter_by_days(365 * 5)
            if five_year_data:
                data_sets['5y'] = five_year_data
            
            # 10 years
            ten_year_data = filter_by_days(365 * 10)
            if ten_year_data:
                data_sets['10y'] = ten_year_data
            
            # 20 years
            twenty_year_data = filter_by_days(365 * 20)
            if twenty_year_data:
                data_sets['20y'] = twenty_year_data
            
            # Max (all available data)
            data_sets['max'] = {
                'dates': dates_formatted,
                'open': open_vals,
                'high': high_vals,
                'low': low_vals,
                'close': close_vals,
                'prevClose': close_vals[0] if close_vals else None
            }
        
        # Stock info
        price = info.get("regularMarketPrice", None)
        exchange_name = info.get("fullExchangeName", "")
        long_name = info.get("longName", "")
        quoteType = info.get("quoteType", "N/A")

        # Get Stock Financials
        if quoteType == "EQUITY":

            # Fetch annual income statement
            annual_income = stock.financials
            annual_income = annual_income.T

            time_yearly = []
            for item in annual_income["Total Revenue"].index:
                time_yearly.append(item.strftime("%Y"))

            def getData(name, target_list):
                for item in annual_income[name]:
                    if not (math.isnan(item)):
                        target_list.append(int(item))
                    else:
                        target_list.append("None")
                return target_list

            total_revenue_yearly = []
            total_revenue_yearly = getData("Total Revenue", total_revenue_yearly)

            return {
                "time_yearly": time_yearly,
                "total_revenue_yearly": total_revenue_yearly,
                "symbol": ticker.upper(),
                "price": price,
                "exchangeName": exchange_name,
                "longName": long_name,
                "timeRanges": data_sets,
                "quoteType": quoteType,
                "error": None,
            }
        else:
            return {
                "time_yearly": "N/A",
                "total_revenue_yearly": "N/A",
                "symbol": ticker.upper(),
                "price": price,
                "exchangeName": exchange_name,
                "longName": long_name,
                "timeRanges": data_sets,
                "quoteType": quoteType,
                "error": None
            }
        
    except Exception as e:
        return {"error": str(e), "symbol": ticker.upper()}

@app.route('/api/stockData')
def get_stock_data():
    symbol = request.args.get('symbol', '')
    
    if not symbol:
        return jsonify({"error": "Missing symbol"}), 400
    
    result = get_all_time_data(symbol)
    
    if result.get("error"):
        return jsonify(result), 500
    
    return jsonify(result)

# Keep the old endpoint for backward compatibility
@app.route('/api/graphData')
def get_graph_data():
    symbol = request.args.get('symbol', '')
    time = request.args.get('time', '3mo')
    
    if not symbol:
        return jsonify({"error": "Missing symbol"}), 400
    
    # Get all data and return just the requested time range
    all_data = get_all_time_data(symbol)
    
    if all_data.get("error"):
        return jsonify(all_data), 500
    
    time_range_data = all_data["timeRanges"].get(time, {})
    
    return jsonify({
        "dates": time_range_data.get("dates", []),
        "open": time_range_data.get("open", []),
        "high": time_range_data.get("high", []),
        "low": time_range_data.get("low", []),
        "close": time_range_data.get("close", []),
        "price": all_data["price"],
        "symbol": all_data["symbol"],
        "exchangeName": all_data["exchangeName"],
        "longName": all_data["longName"],
        "prevClose": time_range_data.get("prevClose", None),
        "error": "",
        "time": time,
    })

if __name__ == "__main__":
    app.run(port=5001, debug=False)