# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # Enables requests from your React frontend

@app.route('/api/stock', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'error': 'Missing symbol'}), 400

    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period='1d')
        return jsonify(data.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)