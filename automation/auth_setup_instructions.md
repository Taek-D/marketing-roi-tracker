# Authentication & Setup Guide

## 1. Google Cloud Project Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project "MarketingROI Tracker".
3. Enable APIs:
   - **Google Ads API**
   - **Google Sheets API**
4. Configure OAuth Consent Screen:
   - User Type: External (or Internal if G-Suite).
   - Scopes: `https://www.googleapis.com/auth/adwords`, `https://www.googleapis.com/auth/spreadsheets`.
5. Create Credentials (OAuth Client ID):
   - Application Type: Web Application.
   - Redirect URI: `https://script.google.com/macros/d/{YOUR_SCRIPT_ID}/usercallback` (You will get Script ID later).

## 2. Facebook App Setup
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create an App (Type: Business).
3. Add **Marketing API** product.
4. Generate **System User Access Token** (Permanent) or Long-lived Token.
   - Scopes: `ads_read`, `read_insights`.

## 3. Google Apps Script Configuration
1. Open your Google Sheet.
2. Extensions > Apps Script.
3. Project Settings > Script Properties.
4. Add the following properties:
   - `GOOGLE_ADS_CUSTOMER_ID`: (Your Ad Account ID, no dashes)
   - `GOOGLE_ADS_DEVELOPER_TOKEN`: (From Google Ads Manager)
   - `GOOGLE_ADS_REFRESH_TOKEN`: (OAuth2 Refresh Token)
   - `FB_AD_ACCOUNT_ID`: (act_XXXXXXXX)
   - `FB_ACCESS_TOKEN`: (From Meta)
   - `NAVER_ADS_CUSTOMER_ID`: (Optional - 광고주 ID)
   - `NAVER_ADS_API_KEY`: (Optional - API Key)
   - `NAVER_ADS_SECRET_KEY`: (Optional - Secret Key)
   - `SLACK_WEBHOOK_URL`: (Optional - For notifications)

> **Quick Setup**: `Setup.gs`의 `setupAll()` 함수를 먼저 실행하면 시트 생성 + 테스트 데이터가 자동으로 세팅됩니다.

## 4. Naver Search Ads Setup (Optional)
네이버 검색광고 연동 가이드: [naver_setup_guide.md](./naver_setup_guide.md)

## 5. Initial Test
Apps Script 에디터에서 `main` 함수를 실행하여 연결을 확인하세요.
`View > Logs`에서 각 채널의 fetch 로그를 확인할 수 있습니다.
