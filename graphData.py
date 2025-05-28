from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/api/graphData')
def get_graphData():
    symbol = request.args.get('symbol', '')
    time = request.args.get('time', '')
    if not symbol:
        return jsonify({"error": "Missing symbol"}), 400
    
    symbol = symbol.upper()

    try:
        ticker = yf.Ticker(symbol)

        info = ticker.info

        if time == "1d":
            hist = ticker.history(period="1d", interval="1m")
            dates = hist.index.strftime('%I:%M %p').tolist()
            prevClose = info.get("previousClose", None)
        elif time == "5d":
            hist = ticker.history(period="5d", interval="15m")
            dates = hist.index.strftime('%B %d, %Y %I:%M %p').tolist()
            prevClose = hist.iloc[0]["Open"] if not hist.empty else None
        else:
            hist = ticker.history(period=time)
            dates = hist.index.strftime('%B %d, %Y').tolist() 
            if time == "max":   
                prevClose = hist.iloc[0]["Close"] if not hist.empty else None   
            else:  
                prevClose = hist.iloc[0]["Open"] if not hist.empty else None   

        open = hist['Open'].tolist()
        high = hist['High'].tolist()
        low = hist['Low'].tolist()
        close = hist['Close'].tolist()
        
        price = info.get("regularMarketPrice", None)
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
            "time": time,
        })
    except Exception as e:
        return jsonify({"error": str(e), "symbol": symbol}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=False)
