from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/graphData')
def get_graphData():
    symbol = request.args.get('symbol', '')
    if not symbol:
        return jsonify({"error": "Missing symbol"}), 400
    
    symbol = symbol.upper()

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="3mo")

        # Convert datetime index to string dates
        dates = hist.index.strftime('%Y-%m-%d').tolist()

        open = hist['Open'].tolist()
        high = hist['High'].tolist()
        low = hist['Low'].tolist()
        close = hist['Close'].tolist()

        info = ticker.info
        price = info.get("regularMarketPrice", None)
        prevClose = info.get("previousClose", None)
        exchangeName = info.get("fullExchangeName", "")
        longName = info.get("longName", "")



        return jsonify({
            "dates": dates,
            "open": open,
            "high": high,
            "low": low,
            "close": close,
            "price": price,
            "symbol": symbol,
            "exchangeName": exchangeName,
            "longName": longName,
            "prevClose": prevClose,
            "error": "",
        })
    except Exception as e:
        return jsonify({"error": str(e), "symbol": symbol}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=False)
