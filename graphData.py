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
                        target_list.append(float(item))
                    else:
                        target_list.append("None")
                return target_list

            # Revenue
            total_revenue_yearly = []
            try:
                total_revenue_yearly = getData("Total Revenue", total_revenue_yearly)
            except:
                for i in range(4):
                    total_revenue_yearly.append("N/A")

            # COGS
            total_cogs_yearly = []
            try:
                total_cogs_yearly = getData("Cost Of Revenue", total_cogs_yearly)
            except:
                for i in range(4):
                    total_cogs_yearly.append("N/A")

            # Gross Profit
            total_gross_profit_yearly = []
            try:
                for i in range(4):
                    total_gross_profit_yearly.append(total_revenue_yearly[i] - total_cogs_yearly[i])
            except:
                for i in range(4):
                    total_gross_profit_yearly.append("N/A")

            # Gross Margin
            total_gross_margin_yearly = []
            try:
                for i in range(4):
                    total_gross_margin_yearly.append(total_gross_profit_yearly[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    total_gross_margin_yearly.append("N/A")

            # EBIT (Operating Income)
            total_ebit_yearly = []
            try:
                total_ebit_yearly = getData("Operating Income", total_ebit_yearly)
            except:
                for i in range(4):
                    total_ebit_yearly.append("N/A")

            # Operating Expense
            total_operating_expenses_yearly = []
            try:
                for i in range(4):
                    total_operating_expenses_yearly.append(total_revenue_yearly[i] - total_ebit_yearly[i])
            except:
                for i in range(4):
                    total_operating_expenses_yearly.append("N/A")

            # EBIT Margin
            total_ebit_margin_yearly = []
            try:
                for i in range(4):
                    total_ebit_margin_yearly.append(total_ebit_yearly[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    total_ebit_margin_yearly.append("N/A")

            # EBITDA
            total_ebitda_yearly = []
            try:
                total_ebitda_yearly = getData("EBITDA", total_ebitda_yearly)
            except:
                for i in range(4):  # Fixed: range(4) instead of range[0:4]
                    total_ebitda_yearly.append("N/A")  # Fixed: append instead of direct assignment

            # EBITDA Margin
            total_ebitda_margin_yearly = []
            try:
                for i in range(4):
                    total_ebitda_margin_yearly.append(total_ebitda_yearly[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    total_ebitda_margin_yearly.append("N/A")

            # Pretax Income
            total_pretax_income_yearly = []
            try:
                total_pretax_income_yearly = getData("Pretax Income", total_pretax_income_yearly)
            except:
                for i in range(4):  # Fixed: range(4) instead of range[0:4]
                    total_pretax_income_yearly.append("N/A")

            # Tax provision
            total_tax_provision_yearly = []
            try:
                total_tax_provision_yearly = getData("Tax Provision", total_tax_provision_yearly)
            except:
                for i in range(4):  # Fixed: range(4) instead of range[0:4]
                    total_tax_provision_yearly.append("N/A")

            # net income
            total_net_income_yearly = []
            try:
                total_net_income_yearly = getData("Net Income", total_net_income_yearly)
            except:
                for i in range(4):  # Fixed: range(4) instead of range[0:4]
                    total_net_income_yearly.append("N/A")

            # net profit margin
            total_net_profit_margin_yearly = []
            try:
                for i in range(4):
                    total_net_profit_margin_yearly.append(total_net_income_yearly[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    total_net_profit_margin_yearly.append("N/A")

            # eps diluted
            total_diluted_eps_yearly = []
            try:
                total_diluted_eps_yearly = getData("Diluted EPS", total_diluted_eps_yearly)
            except:
                for i in range(4):  # Fixed: range(4) instead of range[0:4]
                    total_diluted_eps_yearly.append("N/A")

            
        #     # Get Stock Financials (Quarterly)
        # if quoteType == "EQUITY":

        #     # Fetch quarterly income statement
        #     quarterly_income = stock.quarterly_financials
        #     quarterly_income = quarterly_income.T

        #     time_quarterly = []
        #     for item in quarterly_income["Total Revenue"].index:
        #         quarter = ((item.month - 1) // 3) + 1
        #         time_quarterly.append(f"{item.year}-Q{quarter}")  # Format as YYYY-Q1, YYYY-Q2, etc.

            # def getData(name, target_list):
            #     for item in quarterly_income[name]:
            #         if not (math.isnan(item)):
            #             target_list.append(float(item))
            #         else:
            #             target_list.append("None")
            #     return target_list

            # # Revenue
            # total_revenue_quarterly = []
            # try:
            #     total_revenue_quarterly = getData("Total Revenue", total_revenue_quarterly)
            # except:
            #     for i in range(4):  # Last 4 quarters
            #         total_revenue_quarterly.append("N/A")

            # # COGS
            # total_cogs_quarterly = []
            # try:
            #     total_cogs_quarterly = getData("Cost Of Revenue", total_cogs_quarterly)
            # except:
            #     for i in range(4):
            #         total_cogs_quarterly.append("N/A")

            # # Gross Profit
            # total_gross_profit_quarterly = []
            # try:
            #     for i in range(4):
            #         total_gross_profit_quarterly.append(total_revenue_quarterly[i] - total_cogs_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_gross_profit_quarterly.append("N/A")

            # # Gross Margin
            # total_gross_margin_quarterly = []
            # try:
            #     for i in range(4):
            #         total_gross_margin_quarterly.append(total_gross_profit_quarterly[i] / total_revenue_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_gross_margin_quarterly.append("N/A")

            # # EBIT (Operating Income)
            # total_ebit_quarterly = []
            # try:
            #     total_ebit_quarterly = getData("Operating Income", total_ebit_quarterly)
            # except:
            #     for i in range(4):
            #         total_ebit_quarterly.append("N/A")

            # # Operating Expense
            # total_operating_expenses_quarterly = []
            # try:
            #     for i in range(4):
            #         total_operating_expenses_quarterly.append(total_revenue_quarterly[i] - total_ebit_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_operating_expenses_quarterly.append("N/A")

            # # EBIT Margin
            # total_ebit_margin_quarterly = []
            # try:
            #     for i in range(4):
            #         total_ebit_margin_quarterly.append(total_ebit_quarterly[i] / total_revenue_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_ebit_margin_quarterly.append("N/A")

            # # EBITDA
            # total_ebitda_quarterly = []
            # try:
            #     total_ebitda_quarterly = getData("EBITDA", total_ebitda_quarterly)
            # except:
            #     for i in range(4):
            #         total_ebitda_quarterly.append("N/A")

            # # EBITDA Margin
            # total_ebitda_margin_quarterly = []
            # try:
            #     for i in range(4):
            #         total_ebitda_margin_quarterly.append(total_ebitda_quarterly[i] / total_revenue_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_ebitda_margin_quarterly.append("N/A")

            # # Pretax Income
            # total_pretax_income_quarterly = []
            # try:
            #     total_pretax_income_quarterly = getData("Pretax Income", total_pretax_income_quarterly)
            # except:
            #     for i in range(4):
            #         total_pretax_income_quarterly.append("N/A")

            # # Tax provision
            # total_tax_provision_quarterly = []
            # try:
            #     total_tax_provision_quarterly = getData("Tax Provision", total_tax_provision_quarterly)
            # except:
            #     for i in range(4):
            #         total_tax_provision_quarterly.append("N/A")

            # # net income
            # total_net_income_quarterly = []
            # try:
            #     total_net_income_quarterly = getData("Net Income", total_net_income_quarterly)
            # except:
            #     for i in range(4):
            #         total_net_income_quarterly.append("N/A")

            # # net profit margin
            # total_net_profit_margin_quarterly = []
            # try:
            #     for i in range(4):
            #         total_net_profit_margin_quarterly.append(total_net_income_quarterly[i] / total_revenue_quarterly[i])
            # except:
            #     for i in range(4):
            #         total_net_profit_margin_quarterly.append("N/A")

            # # eps diluted
            # total_diluted_eps_quarterly = []
            # try:
            #     total_diluted_eps_quarterly = getData("Diluted EPS", total_diluted_eps_quarterly)
            # except:
            #     for i in range(4):
            #         total_diluted_eps_quarterly.append("N/A")
            

        if quoteType == "EQUITY":
            # Fetch annual balance sheet
            annual_balance_sheet = stock.balance_sheet
            annual_balance_sheet = annual_balance_sheet.T

            def getData(name, target_list):
                for item in annual_balance_sheet[name]:
                    if not math.isnan(item):
                        target_list.append(float(item))
                    else:
                        target_list.append("None")
                return target_list
            
            total_working_capital_yearly = []
            try:
                total_working_capital_yearly = getData("Working Capital", total_working_capital_yearly)
            except:
                for i in range(4):
                    total_working_capital_yearly.append("N/A")
            
            total_current_assets_yearly = []
            try:
                total_current_assets_yearly = getData("Current Assets", total_current_assets_yearly)
            except:
                for i in range(4):
                    total_current_assets_yearly.append("N/A")

            total_current_liabilities_yearly = []
            try:
                total_current_liabilities_yearly = getData("Current Liabilities", total_current_liabilities_yearly)
            except:
                for i in range(4):
                    total_current_liabilities_yearly.append("N/A")

            total_current_ratio_yearly = []
            try:
                for i in range(4):
                    total_current_ratio_yearly.append(total_current_assets_yearly[i] / total_current_liabilities_yearly[i])
            except:
                for i in range(4):
                    total_current_ratio_yearly.append("N/A")

            total_cash_equivalents_short_term_yearly = []
            try:
                total_cash_equivalents_short_term_yearly = getData("Cash Cash Equivalents And Short Term Investments", total_cash_equivalents_short_term_yearly)
            except:
                for i in range(4):
                    total_cash_equivalents_short_term_yearly.append("N/A")

            total_accounts_receivable_yearly = []
            try:
                total_accounts_receivable_yearly = getData("Accounts Receivable", total_accounts_receivable_yearly)
            except:
                for i in range(4):
                    total_accounts_receivable_yearly.append("N/A")

            total_quick_ratio_yearly = []
            try:
                for i in range(4):
                    total_quick_ratio_yearly.append((total_cash_equivalents_short_term_yearly[i] + total_accounts_receivable_yearly[i]) / total_current_liabilities_yearly[i])
            except:
                for i in range(4):
                    total_quick_ratio_yearly.append("N/A")

            total_cash_and_cash_equivalents_yearly = []
            try:
                total_cash_and_cash_equivalents_yearly = getData("Cash And Cash Equivalents", total_cash_and_cash_equivalents_yearly)
            except:
                for i in range(4):
                    total_cash_and_cash_equivalents_yearly.append("N/A")

            total_cash_ratio_yearly = []
            try:
                for i in range(4):
                    total_cash_ratio_yearly.append(total_cash_and_cash_equivalents_yearly[i] / total_current_liabilities_yearly[i])
            except:
                for i in range(4):
                    total_cash_ratio_yearly.append("N/A")

            total_total_liabilities_yearly = []
            try:
                total_total_liabilities_yearly = getData("Total Liabilities Net Minority Interest", total_total_liabilities_yearly)
            except:
                for i in range(4):
                    total_total_liabilities_yearly.append("N/A")

            total_total_assets_yearly = []
            try:
                total_total_assets_yearly = getData("Total Assets", total_total_assets_yearly)
            except:
                for i in range(4):
                    total_total_assets_yearly.append("N/A")

            total_solvency_ratio_yearly = []
            try:
                for i in range(4):
                    total_solvency_ratio_yearly.append(total_total_assets_yearly[i] / total_total_liabilities_yearly[i])
            except:
                for i in range(4):
                    total_solvency_ratio_yearly.append("N/A")

            total_shareholder_equity_yearly = []
            try:
                total_shareholder_equity_yearly = getData("Stockholders Equity", total_shareholder_equity_yearly)
            except:
                for i in range(4):
                    total_shareholder_equity_yearly.append("N/A")

            total_de_ratio_yearly = []
            try:
                for i in range(4):
                    total_de_ratio_yearly.append(total_total_liabilities_yearly[i] / total_shareholder_equity_yearly[i])
            except:
                for i in range(4):
                    total_de_ratio_yearly.append("N/A")

            total_long_term_debt_yearly = []
            try:
                total_long_term_debt_yearly = getData("Long Term Debt", total_long_term_debt_yearly)
            except:
                for i in range(4):
                    total_long_term_debt_yearly.append("N/A")

            total_capitalization_ratio_yearly = []
            try:
                for i in range(4):
                    total_capitalization_ratio_yearly.append(total_long_term_debt_yearly[i] / (total_long_term_debt_yearly[i] + total_shareholder_equity_yearly[i]))
            except:
                for i in range(4):
                    total_capitalization_ratio_yearly.append("N/A")

            total_equity_ratio_yearly = []
            try:
                for i in range(4):
                    total_equity_ratio_yearly.append(total_shareholder_equity_yearly[i] / total_total_assets_yearly[i])
            except:
                for i in range(4):
                    total_equity_ratio_yearly.append("N/A")

            total_goodwill_and_other_intangible_assets_yearly = []
            try:
                total_goodwill_and_other_intangible_assets_yearly = getData("Goodwill And Other Intangible Assets", total_goodwill_and_other_intangible_assets_yearly)
            except:
                for i in range(4):
                    total_goodwill_and_other_intangible_assets_yearly.append("N/A")

            total_tangible_book_value_yearly = []
            try:
                total_tangible_book_value_yearly = getData("Tangible Book Value", total_tangible_book_value_yearly)
            except:
                for i in range(4):
                    total_tangible_book_value_yearly.append("N/A")

            total_book_value_yearly = []
            try:
                for i in range(4):
                    total_book_value_yearly.append(total_tangible_book_value_yearly[i] + total_goodwill_and_other_intangible_assets_yearly[i])
            except:
                for i in range(4):
                    total_book_value_yearly.append("N/A")
            
            total_ordinary_shares_number_yearly = []
            try:
                total_ordinary_shares_number_yearly = getData("Ordinary Shares Number", total_ordinary_shares_number_yearly)
            except:
                for i in range(4):
                    total_ordinary_shares_number_yearly.append("N/A")

            total_book_value_share_yearly = []
            try:
                for i in range(4):
                    total_book_value_share_yearly.append(total_book_value_yearly[i] / total_ordinary_shares_number_yearly[i])
            except:
                for i in range(4):
                    total_book_value_share_yearly.append("N/A")

            total_tangible_book_value_share_yearly = []
            try:
                for i in range(4):
                    total_tangible_book_value_share_yearly.append(total_tangible_book_value_yearly[i] / total_ordinary_shares_number_yearly[i])
            except:
                for i in range(4):
                    total_tangible_book_value_share_yearly.append("N/A")

            total_asset_turnover_ratio_yearly = []
            try:
                for i in range(4):
                    total_asset_turnover_ratio_yearly.append(total_revenue_yearly[i] / total_total_assets_yearly[i])
            except:
                for i in range(4):
                    total_asset_turnover_ratio_yearly.append("N/A")

            total_inventory_yearly = []
            try:
                total_inventory_yearly = getData("Inventory", total_inventory_yearly)
            except:
                for i in range(4):
                    total_inventory_yearly.append("N/A")

            total_inventory_turnover_yearly = []
            try:
                for i in range(4):
                    total_inventory_turnover_yearly.append(total_cogs_yearly[i] / total_inventory_yearly[i])
            except:
                for i in range(4):
                    total_inventory_turnover_yearly.append("N/A")

        # if quoteType == "EQUITY":
        #     # Fetch quarterly balance sheet
        #     quarterly_balance_sheet = stock.quarterly_balance_sheet
        #     quarterly_balance_sheet = quarterly_balance_sheet.T

        #     def getData(name, target_list):
        #         for item in quarterly_balance_sheet[name]:
        #             if not math.isnan(item):
        #                 target_list.append(float(item))
        #             else:
        #                 target_list.append("None")
        #         return target_list
            
        #     total_working_capital_quarterly = []
        #     try:
        #         total_working_capital_quarterly = getData("Working Capital", total_working_capital_quarterly)
        #     except:
        #         for i in range(4):
        #             total_working_capital_quarterly.append("N/A")
            
        #     total_current_assets_quarterly = []
        #     try:
        #         total_current_assets_quarterly = getData("Current Assets", total_current_assets_quarterly)
        #     except:
        #         for i in range(4):
        #             total_current_assets_quarterly.append("N/A")

        #     total_current_liabilities_quarterly = []
        #     try:
        #         total_current_liabilities_quarterly = getData("Current Liabilities", total_current_liabilities_quarterly)
        #     except:
        #         for i in range(4):
        #             total_current_liabilities_quarterly.append("N/A")

        #     total_current_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_current_ratio_quarterly.append(total_current_assets_quarterly[i] / total_current_liabilities_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_current_ratio_quarterly.append("N/A")

        #     total_cash_equivalents_short_term_quarterly = []
        #     try:
        #         total_cash_equivalents_short_term_quarterly = getData("Cash Cash Equivalents And Short Term Investments", total_cash_equivalents_short_term_quarterly)
        #     except:
        #         for i in range(4):
        #             total_cash_equivalents_short_term_quarterly.append("N/A")

        #     total_accounts_receivable_quarterly = []
        #     try:
        #         total_accounts_receivable_quarterly = getData("Accounts Receivable", total_accounts_receivable_quarterly)
        #     except:
        #         for i in range(4):
        #             total_accounts_receivable_quarterly.append("N/A")

        #     total_quick_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_quick_ratio_quarterly.append((total_cash_equivalents_short_term_quarterly[i] + total_accounts_receivable_quarterly[i]) / total_current_liabilities_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_quick_ratio_quarterly.append("N/A")

        #     total_cash_and_cash_equivalents_quarterly = []
        #     try:
        #         total_cash_and_cash_equivalents_quarterly = getData("Cash And Cash Equivalents", total_cash_and_cash_equivalents_quarterly)
        #     except:
        #         for i in range(4):
        #             total_cash_and_cash_equivalents_quarterly.append("N/A")

        #     total_cash_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_cash_ratio_quarterly.append(total_cash_and_cash_equivalents_quarterly[i] / total_current_liabilities_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_cash_ratio_quarterly.append("N/A")

        #     total_total_liabilities_quarterly = []
        #     try:
        #         total_total_liabilities_quarterly = getData("Total Liabilities Net Minority Interest", total_total_liabilities_quarterly)
        #     except:
        #         for i in range(4):
        #             total_total_liabilities_quarterly.append("N/A")

        #     total_total_assets_quarterly = []
        #     try:
        #         total_total_assets_quarterly = getData("Total Assets", total_total_assets_quarterly)
        #     except:
        #         for i in range(4):
        #             total_total_assets_quarterly.append("N/A")

        #     total_solvency_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_solvency_ratio_quarterly.append(total_total_assets_quarterly[i] / total_total_liabilities_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_solvency_ratio_quarterly.append("N/A")

        #     total_shareholder_equity_quarterly = []
        #     try:
        #         total_shareholder_equity_quarterly = getData("Stockholders Equity", total_shareholder_equity_quarterly)
        #     except:
        #         for i in range(4):
        #             total_shareholder_equity_quarterly.append("N/A")

        #     total_de_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_de_ratio_quarterly.append(total_total_liabilities_quarterly[i] / total_shareholder_equity_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_de_ratio_quarterly.append("N/A")

        #     total_long_term_debt_quarterly = []
        #     try:
        #         total_long_term_debt_quarterly = getData("Long Term Debt", total_long_term_debt_quarterly)
        #     except:
        #         for i in range(4):
        #             total_long_term_debt_quarterly.append("N/A")

        #     total_capitalization_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_capitalization_ratio_quarterly.append(total_long_term_debt_quarterly[i] / (total_long_term_debt_quarterly[i] + total_shareholder_equity_quarterly[i]))
        #     except:
        #         for i in range(4):
        #             total_capitalization_ratio_quarterly.append("N/A")

        #     total_equity_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_equity_ratio_quarterly.append(total_shareholder_equity_quarterly[i] / total_total_assets_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_equity_ratio_quarterly.append("N/A")

        #     total_goodwill_and_other_intangible_assets_quarterly = []
        #     try:
        #         total_goodwill_and_other_intangible_assets_quarterly = getData("Goodwill And Other Intangible Assets", total_goodwill_and_other_intangible_assets_quarterly)
        #     except:
        #         for i in range(4):
        #             total_goodwill_and_other_intangible_assets_quarterly.append("N/A")

        #     total_tangible_book_value_quarterly = []
        #     try:
        #         total_tangible_book_value_quarterly = getData("Tangible Book Value", total_tangible_book_value_quarterly)
        #     except:
        #         for i in range(4):
        #             total_tangible_book_value_quarterly.append("N/A")

        #     total_book_value_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_book_value_quarterly.append(total_tangible_book_value_quarterly[i] + total_goodwill_and_other_intangible_assets_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_book_value_quarterly.append("N/A")
            
        #     total_ordinary_shares_number_quarterly = []
        #     try:
        #         total_ordinary_shares_number_quarterly = getData("Ordinary Shares Number", total_ordinary_shares_number_quarterly)
        #     except:
        #         for i in range(4):
        #             total_ordinary_shares_number_quarterly.append("N/A")

        #     total_book_value_share_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_book_value_share_quarterly.append(total_book_value_quarterly[i] / total_ordinary_shares_number_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_book_value_share_quarterly.append("N/A")

        #     total_tangible_book_value_share_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_tangible_book_value_share_quarterly.append(total_tangible_book_value_quarterly[i] / total_ordinary_shares_number_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_tangible_book_value_share_quarterly.append("N/A")

        #     total_asset_turnover_ratio_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_asset_turnover_ratio_quarterly.append(total_revenue_quarterly[i] / total_total_assets_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_asset_turnover_ratio_quarterly.append("N/A")

        #     total_inventory_quarterly = []
        #     try:
        #         total_inventory_quarterly = getData("Inventory", total_inventory_quarterly)
        #     except:
        #         for i in range(4):
        #             total_inventory_quarterly.append("N/A")

        #     total_inventory_turnover_quarterly = []
        #     try:
        #         for i in range(4):
        #             total_inventory_turnover_quarterly.append(total_cogs_quarterly[i] / total_inventory_quarterly[i])
        #     except:
        #         for i in range(4):
        #             total_inventory_turnover_quarterly.append("N/A")    

        if quoteType == "EQUITY":
            # Fetch annual cash flow
            annual_cash_flow = stock.cashflow
            annual_cash_flow = annual_cash_flow.T  # Transpose to make it easier to iterate by year

            def getData(name, target_list):
                for item in annual_cash_flow[name]:
                    if not math.isnan(item):
                        target_list.append(float(item))
                    else:
                        target_list.append("None")
                return target_list

            operating_cash_flow_y = []
            try:
                operating_cash_flow_y = getData("Operating Cash Flow", operating_cash_flow_y)
            except:
                for i in range(4):
                    operating_cash_flow_y.append("N/A")

            free_cash_flow_y = []
            try:
                free_cash_flow_y = getData("Free Cash Flow", free_cash_flow_y)
            except:
                for i in range(4):
                    free_cash_flow_y.append("N/A")

            fcf_margin_y = []
            try:
                for i in range(4):
                    fcf_margin_y.append(free_cash_flow_y[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    fcf_margin_y.append("N/A")   

            cashflow_margin_y = []
            try:
                for i in range(4):
                    cashflow_margin_y.append(operating_cash_flow_y[i] / total_revenue_yearly[i])
            except:
                for i in range(4):
                    cashflow_margin_y.append("N/A") 

            cashflow_to_net_income_margin_y = []
            try:
                for i in range(4):
                    cashflow_to_net_income_margin_y.append(operating_cash_flow_y[i] / total_net_income_yearly[i])
            except:
                for i in range(4):
                    cashflow_to_net_income_margin_y.append("N/A") 

            capEx_y = []
            try:
                capEx_y = getData("Capital Expenditure", capEx_y)
            except:
                for i in range(4):
                    capEx_y.append("N/A")

            capEx_ratio_y = []
            try:
                for i in range(4):
                    capEx_ratio_y.append(capEx_y[i] / operating_cash_flow_y[i])
            except:
                for i in range(4):
                    capEx_ratio_y.append("N/A") 

            common_stock_dividends_y = []
            try:
                common_stock_dividends_y = getData("Common Stock Dividend Paid", common_stock_dividends_y)
            except:
                for i in range(4):
                    common_stock_dividends_y.append("N/A")

            reinvestment_ratio_y = []
            try:
                for i in range(4):
                    reinvestment_ratio_y.append(1 - (common_stock_dividends_y[i] / total_net_income_yearly[i]))
            except:
                for i in range(4):
                    reinvestment_ratio_y.append("N/A") 

            dividend_coverage_y = []
            try:
                for i in range(4):
                    dividend_coverage_y.append(operating_cash_flow_y[i] / common_stock_dividends_y[i])
            except:
                for i in range(4):
                    dividend_coverage_y.append("N/A") 

            interest_paid_y = []
            try:
                interest_paid_y = getData("Interest Paid Supplemental Data", interest_paid_y)
            except:
                for i in range(4):
                    interest_paid_y.append("N/A")

            cash_interest_cov_y = []
            try:
                for i in range(4):
                    cash_interest_cov_y.append(operating_cash_flow_y[i] / interest_paid_y[i])
            except:
                for i in range(4):
                    cash_interest_cov_y.append("N/A") 

            cash_return_assets_y = []
            try:
                for i in range(4):
                    cash_return_assets_y.append(operating_cash_flow_y[i] / total_total_assets_yearly[i])
            except:
                for i in range(4):
                    cash_return_assets_y.append("N/A") 
            
            cash_return_equity_y = []
            try:
                for i in range(4):
                    cash_return_equity_y.append(operating_cash_flow_y[i] / total_shareholder_equity_yearly[i])
            except:
                for i in range(4):
                    cash_return_equity_y.append("N/A") 

            cash_convert_ratio_y = []
            try:
                for i in range(4):
                    cash_convert_ratio_y.append(operating_cash_flow_y[i] / total_net_income_yearly[i])
            except:
                for i in range(4):
                    cash_convert_ratio_y.append("N/A") 

            net_borrowing_y = []
            try:
                net_borrowing_y = getData("Net Issuance Payments Of Debt", net_borrowing_y)
            except:
                for i in range(4):
                    net_borrowing_y.append("N/A")

            fcf_to_equity_y = []
            try:
                for i in range(4):
                    fcf_to_equity_y.append(operating_cash_flow_y[i] - capEx_y[i] + net_borrowing_y[i])
            except:
                for i in range(4):
                    fcf_to_equity_y.append("N/A") 

        # if quoteType == "EQUITY":
        #     # Fetch quarterly cash flow
        #     quarterly_cash_flow = stock.quarterly_cashflow
        #     quarterly_cash_flow = quarterly_cash_flow.T  # Transpose to make it easier to iterate by quarter

        #     def getData(name, target_list):
        #         for item in quarterly_cash_flow[name]:
        #             if not math.isnan(item):
        #                 target_list.append(float(item))
        #             else:
        #                 target_list.append("None")
        #         return target_list

        #     operating_cash_flow_q = []
        #     try:
        #         operating_cash_flow_q = getData("Operating Cash Flow", operating_cash_flow_q)
        #     except:
        #         for i in range(4):
        #             operating_cash_flow_q.append("N/A")

        #     free_cash_flow_q = []
        #     try:
        #         free_cash_flow_q = getData("Free Cash Flow", free_cash_flow_q)
        #     except:
        #         for i in range(4):
        #             free_cash_flow_q.append("N/A")

        #     fcf_margin_q = []
        #     try:
        #         for i in range(4):
        #             fcf_margin_q.append(free_cash_flow_q[i] / total_revenue_quarterly[i])
        #     except:
        #         for i in range(4):
        #             fcf_margin_q.append("N/A")   

        #     cashflow_margin_q = []
        #     try:
        #         for i in range(4):
        #             cashflow_margin_q.append(operating_cash_flow_q[i] / total_revenue_quarterly[i])
        #     except:
        #         for i in range(4):
        #             cashflow_margin_q.append("N/A") 

        #     cashflow_to_net_income_margin_q = []
        #     try:
        #         for i in range(4):
        #             cashflow_to_net_income_margin_q.append(operating_cash_flow_q[i] / total_net_income_quarterly[i])
        #     except:
        #         for i in range(4):
        #             cashflow_to_net_income_margin_q.append("N/A") 

        #     capEx_q = []
        #     try:
        #         capEx_q = getData("Capital Expenditure", capEx_q)
        #     except:
        #         for i in range(4):
        #             capEx_q.append("N/A")

        #     capEx_ratio_q = []
        #     try:
        #         for i in range(4):
        #             capEx_ratio_q.append(capEx_q[i] / operating_cash_flow_q[i])
        #     except:
        #         for i in range(4):
        #             capEx_ratio_q.append("N/A") 

        #     common_stock_dividends_q = []
        #     try:
        #         common_stock_dividends_q = getData("Common Stock Dividend Paid", common_stock_dividends_q)
        #     except:
        #         for i in range(4):
        #             common_stock_dividends_q.append("N/A")

        #     reinvestment_ratio_q = []
        #     try:
        #         for i in range(4):
        #             reinvestment_ratio_q.append(1 - (common_stock_dividends_q[i] / total_net_income_quarterly[i]))
        #     except:
        #         for i in range(4):
        #             reinvestment_ratio_q.append("N/A") 

        #     dividend_coverage_q = []
        #     try:
        #         for i in range(4):
        #             dividend_coverage_q.append(operating_cash_flow_q[i] / common_stock_dividends_q[i])
        #     except:
        #         for i in range(4):
        #             dividend_coverage_q.append("N/A") 

        #     interest_paid_q = []
        #     try:
        #         interest_paid_q = getData("Interest Paid Supplemental Data", interest_paid_q)
        #     except:
        #         for i in range(4):
        #             interest_paid_q.append("N/A")

        #     cash_interest_cov_q = []
        #     try:
        #         for i in range(4):
        #             cash_interest_cov_q.append(operating_cash_flow_q[i] / interest_paid_q[i])
        #     except:
        #         for i in range(4):
        #             cash_interest_cov_q.append("N/A") 

        #     cash_return_assets_q = []
        #     try:
        #         for i in range(4):
        #             cash_return_assets_q.append(operating_cash_flow_q[i] / total_total_assets_quarterly[i])
        #     except:
        #         for i in range(4):
        #             cash_return_assets_q.append("N/A") 
            
        #     cash_return_equity_q = []
        #     try:
        #         for i in range(4):
        #             cash_return_equity_q.append(operating_cash_flow_q[i] / total_shareholder_equity_quarterly[i])
        #     except:
        #         for i in range(4):
        #             cash_return_equity_q.append("N/A") 

        #     cash_convert_ratio_q = []
        #     try:
        #         for i in range(4):
        #             cash_convert_ratio_q.append(operating_cash_flow_q[i] / total_net_income_quarterly[i])
        #     except:
        #         for i in range(4):
        #             cash_convert_ratio_q.append("N/A") 

        #     net_borrowing_q = []
        #     try:
        #         net_borrowing_q = getData("Net Issuance Payments Of Debt", net_borrowing_q)
        #     except:
        #         for i in range(4):
        #             net_borrowing_q.append("N/A")

        #     fcf_to_equity_q = []
        #     try:
        #         for i in range(4):
        #             fcf_to_equity_q.append(operating_cash_flow_q[i] - capEx_q[i] + net_borrowing_q[i])
        #     except:
        #         for i in range(4):
        #             fcf_to_equity_q.append("N/A")



            return {
                "time_yearly": time_yearly,
                "total_revenue_yearly": total_revenue_yearly,
                "total_cogs_yearly": total_cogs_yearly,
                "total_gross_profit_yearly": total_gross_profit_yearly,
                "total_gross_margin_yearly": total_gross_margin_yearly,
                "total_ebit_yearly": total_ebit_yearly,
                "total_operating_expenses_yearly": total_operating_expenses_yearly,
                "total_ebit_margin_yearly": total_ebit_margin_yearly,
                "total_ebitda_yearly": total_ebitda_yearly,
                "total_ebitda_margin_yearly": total_ebitda_margin_yearly,
                "total_pretax_income_yearly": total_pretax_income_yearly,
                "total_tax_provision_yearly": total_tax_provision_yearly,
                "total_net_income_yearly": total_net_income_yearly,
                "total_net_profit_margin_yearly": total_net_profit_margin_yearly,
                "total_diluted_eps_yearly": total_diluted_eps_yearly,
                "total_cogs_yearly": total_cogs_yearly,
                # "time_quarterly": time_quarterly,
                # "total_revenue_quarterly": total_revenue_quarterly,
                # "total_cogs_quarterly": total_cogs_quarterly,
                # "total_gross_profit_quarterly": total_gross_profit_quarterly,
                # "total_gross_margin_quarterly": total_gross_margin_quarterly,
                # "total_ebit_quarterly": total_ebit_quarterly,
                # "total_operating_expenses_quarterly": total_operating_expenses_quarterly,
                # "total_ebit_margin_quarterly": total_ebit_margin_quarterly,
                # "total_ebitda_quarterly": total_ebitda_quarterly,
                # "total_ebitda_margin_quarterly": total_ebitda_margin_quarterly,
                # "total_pretax_income_quarterly": total_pretax_income_quarterly,
                # "total_tax_provision_quarterly": total_tax_provision_quarterly,
                # "total_net_income_quarterly": total_net_income_quarterly,
                # "total_net_profit_margin_quarterly": total_net_profit_margin_quarterly,
                # "total_diluted_eps_quarterly": total_diluted_eps_quarterly,
                "total_working_capital_yearly": total_working_capital_yearly,
                "total_current_ratio_yearly": total_current_ratio_yearly,
                "total_quick_ratio_yearly": total_quick_ratio_yearly,
                "total_cash_ratio_yearly": total_cash_ratio_yearly,
                "total_solvency_ratio_yearly": total_solvency_ratio_yearly,
                "total_de_ratio_yearly": total_de_ratio_yearly,
                "total_capitalization_ratio_yearly": total_capitalization_ratio_yearly,
                "total_equity_ratio_yearly": total_equity_ratio_yearly,
                "total_book_value_share_yearly": total_book_value_share_yearly,
                "total_tangible_book_value_share_yearly": total_tangible_book_value_share_yearly,
                "total_asset_turnover_ratio_yearly": total_asset_turnover_ratio_yearly,
                "total_inventory_turnover_yearly": total_inventory_turnover_yearly,
                "total_total_assets_yearly": total_total_assets_yearly,
                "total_total_liabilities_yearly": total_total_liabilities_yearly,
                "total_shareholder_equity_yearly": total_shareholder_equity_yearly,
                # "total_working_capital_quarterly": total_working_capital_quarterly,
                # "total_current_ratio_quarterly": total_current_ratio_quarterly,
                # "total_quick_ratio_quarterly": total_quick_ratio_quarterly,
                # "total_cash_ratio_quarterly": total_cash_ratio_quarterly,
                # "total_solvency_ratio_quarterly": total_solvency_ratio_quarterly,
                # "total_de_ratio_quarterly": total_de_ratio_quarterly,
                # "total_capitalization_ratio_quarterly": total_capitalization_ratio_quarterly,
                # "total_equity_ratio_quarterly": total_equity_ratio_quarterly,
                # "total_book_value_share_quarterly": total_book_value_share_quarterly,
                # "total_tangible_book_value_share_quarterly": total_tangible_book_value_share_quarterly,
                # "total_asset_turnover_ratio_quarterly": total_asset_turnover_ratio_quarterly,
                # "total_inventory_turnover_quarterly": total_inventory_turnover_quarterly,
                # "total_total_assets_quarterly": total_total_assets_quarterly,
                # "total_total_liabilities_quarterly": total_total_liabilities_quarterly,
                # "total_shareholder_equity_quarterly": total_shareholder_equity_quarterly,
                "operating_cash_flow_y": operating_cash_flow_y,
                "free_cash_flow_y": free_cash_flow_y,
                "fcf_margin_y": fcf_margin_y,
                "cashflow_margin_y": cashflow_margin_y,
                "cashflow_to_net_income_margin_y": cashflow_to_net_income_margin_y,
                "capEx_ratio_y": capEx_ratio_y,
                "reinvestment_ratio_y": reinvestment_ratio_y,
                "dividend_coverage_y": dividend_coverage_y,
                "cash_interest_cov_y": cash_interest_cov_y,
                "cash_return_assets_y": cash_return_assets_y,
                "cash_return_equity_y": cash_return_equity_y,
                "cash_convert_ratio_y": cash_convert_ratio_y,
                "fcf_to_equity_y": fcf_to_equity_y,
                # "operating_cash_flow_q": operating_cash_flow_q,
                # "free_cash_flow_q": free_cash_flow_q,
                # "fcf_margin_q": fcf_margin_q,
                # "cashflow_margin_q": cashflow_margin_q,
                # "cashflow_to_net_income_margin_q": cashflow_to_net_income_margin_q,
                # "capEx_ratio_q": capEx_ratio_q,
                # "reinvestment_ratio_q": reinvestment_ratio_q,
                # "dividend_coverage_q": dividend_coverage_q,
                # "cash_interest_cov_q": cash_interest_cov_q,
                # "cash_return_assets_q": cash_return_assets_q,
                # "cash_return_equity_q": cash_return_equity_q,
                # "cash_convert_ratio_q": cash_convert_ratio_q,
                # "fcf_to_equity_q": fcf_to_equity_q,
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