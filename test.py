import yfinance as yf

# Create the ticker object
stock = yf.Ticker("aapl")  # Use a valid ticker symbol here

# Get the cash flow statement (annual)
cash_flow = stock.cashflow  # Use stock.quarterly_cashflow for quarterly data

# List the available fields
fields = cash_flow.index.tolist()

for field in fields:
    print(field)


# intangible_assets = balance_sheet.loc["Goodwill And Other Intangible Assets"]
# print(intangible_assets)


# # Fetch annual income statement
# annual_income = stock.financials
# annual_income = annual_income.T


# # # print(annual_income["Normalized EBITDA"]) 
# # # for item in annual_income["Normalized EBITDA"].index:
# # #     print(item.date())

# # time_yearly = []
# # for item in annual_income["Normalized EBITDA"].index:
# #     time_yearly.append(item.strftime("%Y"))
# # print(time_yearly)

# def getData(name, list):
#     for item in balance_sheet[name]:
#         list.append(item)
#     return list

# total_revenue_yearly = []
# total_revenue_yearly = getData("Tangible Book Value", total_revenue_yearly)
# print(total_revenue_yearly)

# # ticker = yf.Ticker("GS")
# # print(ticker.financials.index.tolist())


# # print(annual_income["EBITDA"])  
# # print(annual_income["Total Revenue"])  

# # annual_cash_flow = stock.cashflow
# # annual_cash_flow = annual_cash_flow.T
# # print(annual_cash_flow)

# # annual_balance_sheet = stock.balance_sheet

# # print(annual_balance_sheet)
