import yfinance as yf
import json

ticker_symbol = "mstr"  # Change to any symbol you want
ticker = yf.Ticker(ticker_symbol)

# Print .info
print("\n=== info ===")
print(json.dumps(ticker.info, indent=2))

print("\n\n\n\n\n\n\n\n\n")

# Print .financials
print("\n=== financials (annual income statement) ===")
print(ticker.financials)

# Print .quarterly_financials
print("\n=== quarterly financials ===")
print(ticker.quarterly_financials)

# Print .balance_sheet
print("\n=== balance sheet (annual) ===")
print(ticker.balance_sheet)

# Print .quarterly_balance_sheet
print("\n=== quarterly balance sheet ===")
print(ticker.quarterly_balance_sheet)

# Print .cashflow
print("\n=== cash flow (annual) ===")
print(ticker.cashflow)

# Print .quarterly_cashflow
print("\n=== quarterly cash flow ===")
print(ticker.quarterly_cashflow)

# Print .earnings
print("\n=== earnings (annual) ===")
print(ticker.earnings)

# Print .quarterly_earnings
print("\n=== quarterly earnings ===")
print(ticker.quarterly_earnings)

print("\n\n\n\n\n\n\n\n\n")

# Print .sustainability
print("\n=== sustainability ===")
print(ticker.sustainability)

# Print .recommendations
print("\n=== recommendations ===")
print(ticker.recommendations)

# Print .calendar
print("\n=== calendar ===")
print(ticker.calendar)

# Print .dividends
print("\n=== dividends ===")
print(ticker.dividends)

# Print .splits
print("\n=== splits ===")
print(ticker.splits)

# Print .actions
print("\n=== actions (dividends + splits) ===")
print(ticker.actions)

# Print .history
print("\n=== historical market data (last 5 rows) ===")
print(ticker.history(period="max").tail())
