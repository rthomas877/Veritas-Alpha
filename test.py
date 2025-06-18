import yfinance as yf

# Create the ticker object properly
stock = yf.Ticker("o")  # Use a valid ticker symbol here

balance_sheet = stock.balance_sheet  # for annual
# Or: balance_sheet = stock.quarterly_balance_sheet

fields = balance_sheet.index.tolist()

for field in fields:
    print(field)


# Fetch annual income statement
annual_income = stock.financials
annual_income = annual_income.T

# # print(annual_income["Normalized EBITDA"]) 
# # for item in annual_income["Normalized EBITDA"].index:
# #     print(item.date())

# time_yearly = []
# for item in annual_income["Normalized EBITDA"].index:
#     time_yearly.append(item.strftime("%Y"))
# print(time_yearly)

# def getData(name, list):
#     for item in annual_income[name]:
#         list.append(item)
#     return list

# total_revenue_yearly = []
# total_revenue_yearly = getData("Diluted EPS", total_revenue_yearly)
# print(total_revenue_yearly)

# ticker = yf.Ticker("GS")
# print(ticker.financials.index.tolist())


# print(annual_income["EBITDA"])  
# print(annual_income["Total Revenue"])  

# annual_cash_flow = stock.cashflow
# annual_cash_flow = annual_cash_flow.T
# print(annual_cash_flow)

# annual_balance_sheet = stock.balance_sheet

# print(annual_balance_sheet)
