from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/price')
def get_price():
    symbol = request.args.get('symbol', '')
    if not symbol:
        return jsonify({"error": "Missing symbol"}), 400

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        price = info.get("regularMarketPrice")
        price = "{:,.2f}".format(price)

        change = info.get("regularMarketChange")
        changeReal = "{:,.2f}".format(change)

        percent = info.get("regularMarketChangePercent")
        timestamp = info.get("regularMarketTime")

        # Convert UNIX timestamp to human-readable time
        time_str = "-"
        if timestamp:
            time_obj = datetime.datetime.fromtimestamp(timestamp)
            time_str = time_obj.strftime("%-I:%M:%S %p")

        return jsonify({
            "symbol": symbol,
            "price": price,
            "change": change,
            "changeReal" : changeReal,
            "percent": f"{percent:.2f}%" if percent is not None else None,
            "time": time_str
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False)
