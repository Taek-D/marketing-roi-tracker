"""
Tableau Public 대시보드용 데이터 Export 스크립트

3개의 최적화된 CSV 파일을 생성합니다:
1. tableau_summary.csv - 채널별 집계 데이터
2. tableau_daily.csv - 일별 트렌드 데이터
3. tableau_campaign.csv - 캠페인별 상세 데이터
"""

import pandas as pd
from pathlib import Path

def export_for_tableau():
    """Tableau용 데이터 Export"""
    # 원본 데이터 로드
    data_path = Path(__file__).parent / "data" / "marketing_raw_data.csv"
    df = pd.read_csv(data_path)
    
    print("=" * 60)
    print("Tableau Public 데이터 Export")
    print("=" * 60)
    print(f"\n원본 데이터: {len(df)}행")
    
    # 1. 채널별 집계 (Summary)
    summary = df.groupby('channel').agg({
        'cost': 'sum',
        'impressions': 'sum',
        'clicks': 'sum',
        'conversions': 'sum',
        'revenue': 'sum'
    }).reset_index()
    
    summary['ROAS'] = summary['revenue'] / summary['cost']
    summary['CTR'] = summary['clicks'] / summary['impressions'] * 100
    summary['CVR'] = summary['conversions'] / summary['clicks'] * 100
    summary = summary.round(2)
    
    # 2. 일별 트렌드 (Daily)
    daily = df.groupby(['date', 'channel']).agg({
        'cost': 'sum',
        'revenue': 'sum'
    }).reset_index()
    
    daily['ROAS'] = daily['revenue'] / daily['cost']
    daily = daily.round(2)
    
    # 3. 캠페인별 상세 (Campaign)
    campaign = df.groupby(['channel', 'campaign']).agg({
        'cost': 'sum',
        'impressions': 'sum',
        'clicks': 'sum',
        'conversions': 'sum',
        'revenue': 'sum'
    }).reset_index()
    
    campaign['ROAS'] = campaign['revenue'] / campaign['cost']
    campaign['CTR'] = campaign['clicks'] / campaign['impressions'] * 100
    campaign['CVR'] = campaign['conversions'] / campaign['clicks'] * 100
    campaign = campaign.round(2)
    
    # Export
    output_dir = Path(__file__).parent / "data"
    
    files = {
        'tableau_summary.csv': summary,
        'tableau_daily.csv': daily,
        'tableau_campaign.csv': campaign
    }
    
    print("\n생성된 파일:")
    for filename, data in files.items():
        filepath = output_dir / filename
        data.to_csv(filepath, index=False, encoding='utf-8-sig')
        print(f"  ✅ {filename}: {len(data)}행")
    
    print("\n" + "=" * 60)
    print("Tableau Public에서 사용 방법:")
    print("1. Tableau Public Desktop 설치")
    print("2. 'Connect to Data' → 'Text file' 선택")
    print("3. tableau_summary.csv, tableau_daily.csv 로드")
    print("4. 채널별 ROAS, 일별 트렌드 시각화")
    print("=" * 60)

if __name__ == "__main__":
    export_for_tableau()
