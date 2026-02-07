# MarketingROI Tracker

> Free, automated Marketing ROI Dashboard for Startups & SMBs.  
> Automatically collects data from Google Ads & Facebook Ads into Google Sheets.

## 🚀 Features

- **Automated Data Collection**: Fetches daily stats from Google Ads & Facebook Ads via Apps Script.
- **ROI/ROAS Dashboard**: Visualizes performance across channels.
- **Attribution (MVP)**: Simple Last-Touch attribution model.
- **Zero-Code Setup**: Just copy the sheet and enter API keys.

## 🛠️ Setup Guide

1. **Copy the Google Sheet Template** (Link TBD)
2. **Get API Credentials**: Follow the [Auth Setup Guide](./auth_setup_instructions.md).
3. **Configure Script**:
   - Go to `Extensions > Apps Script`.
   - Open `Project Settings > Script Properties`.
   - Enter your `GOOGLE_ADS_CLIENT_ID`, `FB_ACCESS_TOKEN`, etc.
4. **Run Initialization**:
   - Click `MarketingROI Tracker > Refresh Data` in the spreadsheet menu.
   - Authorize the script.

## 📂 Project Structure

- `Code.gs`: Main entry point and API fetching logic.
- `Config.gs`: Configuration constants.
- `Attribution.gs`: Logic for calculating ROAS and attribution.
- `auth_setup_instructions.md`: Guide for getting API keys.
- `claude.md`: Project blueprint and internal docs.
- `Bridge.md`: Project execution protocol status.

## 🤝 Contribution

1. Fork the repo.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## 📄 License

MIT License.
