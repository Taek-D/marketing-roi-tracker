"""
마케팅 ROI 분석용 실무급 시뮬레이션 데이터 생성기 (Production-Grade)

90일 x 3채널 x 3캠페인 = 810행의 마케팅 데이터를 생성합니다.
실무 데이터의 복잡성과 불규칙성을 반영한 고품질 시뮬레이션입니다.

내장 패턴 (12가지):
1. 채널 효율성 차이: Naver ROAS ~3.2 > Google ~2.8 > Facebook ~2.0
2. 캠페인 차이: Brand > Retargeting > Generic/Interest
3. 요일 효과: Google/Naver 주중 강세, Facebook 주말 강세
4. 성장 트렌드: 90일간 +27% 점진적 성장
5. 체감수익: 고예산 → ROAS 하락 (로그 곡선)
6. 블랙프라이데이: 11/28-12/1 전 채널 매출 3배
7. FB 추적장애: 12/18-19 Facebook만 전환 급락
8. 광고 피로도: Facebook 장기 캠페인 CTR 점진적 하락
9. 경쟁사 이벤트: 11/11 Naver 1일간 CPC 급등
10. 예산 제약: 각 채널 월말 예산 소진으로 광고비 감소
11. A/B 테스트: Google Generic 11/15-11/22 새 소재 테스트
12. 계절성: 12월 연말 쇼핑 시즌으로 전환율 상승

실무 특징:
- 불규칙한 노이즈 (±15-25%)
- 예산 최적화 시뮬레이션 (실무 의사결정 반영)
- 실제 발생 가능한 이벤트 포함
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# 재현 가능성을 위한 시드 고정
np.random.seed(42)

# === 기본 설정 ===
START_DATE = datetime(2024, 10, 1)
NUM_DAYS = 90
END_DATE = START_DATE + timedelta(days=NUM_DAYS - 1)

# 채널 및 캠페인 구조
CHANNELS = {
    "Google Ads": {
        "campaigns": ["Google_Brand", "Google_Generic", "Google_Retargeting"],
        "base_cost": [150, 300, 100],
        "base_roas": [3.5, 2.2, 3.0],
        "ctr": [0.08, 0.03, 0.06],
        "cvr": [0.05, 0.02, 0.04],
        "weekday_boost": 1.15,
        "weekend_boost": 0.80,
    },
    "Facebook Ads": {
        "campaigns": ["FB_Interest", "FB_Lookalike", "FB_Retargeting"],
        "base_cost": [200, 250, 120],
        "base_roas": [1.8, 2.0, 2.5],
        "ctr": [0.04, 0.035, 0.055],
        "cvr": [0.025, 0.03, 0.04],
        "weekday_boost": 0.90,
        "weekend_boost": 1.25,
    },
    "Naver Ads": {
        "campaigns": ["Naver_Brand", "Naver_Shopping", "Naver_Retargeting"],
        "base_cost": [120, 280, 80],
        "base_roas": [4.0, 2.8, 3.5],
        "ctr": [0.07, 0.04, 0.065],
        "cvr": [0.06, 0.03, 0.05],
        "weekday_boost": 1.20,
        "weekend_boost": 0.75,
    },
}

# 특별 이벤트 기간
BLACK_FRIDAY_START = datetime(2024, 11, 28)
BLACK_FRIDAY_END = datetime(2024, 12, 1)
FB_TRACKING_FAILURE_START = datetime(2024, 12, 18)
FB_TRACKING_FAILURE_END = datetime(2024, 12, 19)
NAVER_1111_EVENT = datetime(2024, 11, 11)  # 11.11 이벤트
AB_TEST_START = datetime(2024, 11, 15)
AB_TEST_END = datetime(2024, 11, 22)


def get_growth_factor(day_index: int) -> float:
    """90일간 +27% 성장 트렌드 (점진적 선형 성장)"""
    return 1.0 + (0.27 * day_index / (NUM_DAYS - 1))


def get_weekday_factor(date: datetime, channel_config: dict) -> float:
    """요일 효과: 주중(월~금) vs 주말(토~일) 부스트"""
    if date.weekday() < 5:
        return channel_config["weekday_boost"]
    else:
        return channel_config["weekend_boost"]


def get_diminishing_returns(cost: float, base_cost: float) -> float:
    """체감수익: 광고비가 기본 대비 높을수록 ROAS 하락 (로그 곡선)"""
    ratio = cost / base_cost
    if ratio <= 1.0:
        return 1.0
    return 1.0 / (1.0 + 0.15 * np.log(ratio))


def get_ad_fatigue_factor(day_index: int, channel: str, campaign: str) -> float:
    """광고 피로도: Facebook 장기 캠페인 CTR 점진적 하락"""
    if channel == "Facebook Ads" and "Interest" in campaign:
        # 90일간 CTR 최대 -20% 감소
        return 1.0 - (0.20 * day_index / NUM_DAYS)
    return 1.0


def get_month_end_budget_factor(date: datetime) -> float:
    """예산 제약: 월말 예산 소진으로 광고비 감소"""
    day_of_month = date.day
    # 매월 26일~말일: 예산 소진으로 -30% 감소
    if day_of_month >= 26:
        return 0.70
    return 1.0


def get_year_end_seasonality(date: datetime) -> float:
    """계절성: 12월 연말 쇼핑 시즌 전환율 상승"""
    if date.month == 12:
        # 12월 전환율 +15%
        return 1.15
    return 1.0


def is_black_friday(date: datetime) -> bool:
    """블랙프라이데이 기간 여부"""
    return BLACK_FRIDAY_START <= date <= BLACK_FRIDAY_END


def is_fb_tracking_failure(date: datetime, channel: str) -> bool:
    """Facebook 추적 장애 기간 여부"""
    return (channel == "Facebook Ads" and
            FB_TRACKING_FAILURE_START <= date <= FB_TRACKING_FAILURE_END)


def is_naver_1111_event(date: datetime, channel: str) -> bool:
    """네이버 11.11 이벤트 (CPC 급등)"""
    return channel == "Naver Ads" and date == NAVER_1111_EVENT


def is_ab_test_period(date: datetime, campaign: str) -> bool:
    """Google Generic A/B 테스트 기간"""
    return (campaign == "Google_Generic" and
            AB_TEST_START <= date <= AB_TEST_END)


def generate_data() -> pd.DataFrame:
    """전체 마케팅 데이터 생성"""
    rows = []

    for day_index in range(NUM_DAYS):
        date = START_DATE + timedelta(days=day_index)
        date_str = date.strftime("%Y-%m-%d")
        growth = get_growth_factor(day_index)
        month_end_factor = get_month_end_budget_factor(date)
        seasonality = get_year_end_seasonality(date)

        for channel_name, config in CHANNELS.items():
            weekday_factor = get_weekday_factor(date, config)

            for camp_idx in range(3):
                campaign = config["campaigns"][camp_idx]
                base_cost = config["base_cost"][camp_idx]
                base_roas = config["base_roas"][camp_idx]
                ctr = config["ctr"][camp_idx]
                cvr = config["cvr"][camp_idx]

                # --- 광고비 계산 ---
                # 기본: 성장 + 요일 + 노이즈 (±20%)
                cost_noise = np.random.normal(1.0, 0.20)
                cost = base_cost * growth * weekday_factor * cost_noise * month_end_factor

                # 블랙프라이데이: 광고비 1.5배 증액
                if is_black_friday(date):
                    cost *= 1.5

                # 네이버 11.11: CPC 급등으로 광고비 +40%
                if is_naver_1111_event(date, channel_name):
                    cost *= 1.40

                cost = max(cost, 10)

                # --- 노출수 계산 ---
                cpm = np.random.uniform(8, 15)
                impressions = int(cost / cpm * 1000 * np.random.normal(1.0, 0.12))
                impressions = max(impressions, 100)

                # --- 클릭수 계산 ---
                ad_fatigue = get_ad_fatigue_factor(day_index, channel_name, campaign)
                actual_ctr = ctr * ad_fatigue * np.random.normal(1.0, 0.15)
                
                # A/B 테스트: 새 소재로 CTR +25%
                if is_ab_test_period(date, campaign):
                    actual_ctr *= 1.25
                
                clicks = int(impressions * actual_ctr)
                clicks = max(clicks, 1)

                # --- 전환수 계산 ---
                actual_cvr = cvr * growth * seasonality * np.random.normal(1.0, 0.20)
                conversions = int(clicks * actual_cvr)

                # Facebook 추적 장애: 전환 80% 누락
                if is_fb_tracking_failure(date, channel_name):
                    conversions = max(int(conversions * 0.2), 0)

                conversions = max(conversions, 0)

                # --- 매출 계산 ---
                diminishing = get_diminishing_returns(cost, base_cost)
                effective_roas = base_roas * diminishing

                # 블랙프라이데이: 매출 3배
                if is_black_friday(date):
                    effective_roas *= 2.0

                # A/B 테스트: 소재 개선으로 ROAS +10%
                if is_ab_test_period(date, campaign):
                    effective_roas *= 1.10

                revenue = cost * effective_roas * np.random.normal(1.0, 0.15)

                # Facebook 추적 장애: 매출도 급감
                if is_fb_tracking_failure(date, channel_name):
                    revenue *= 0.25

                revenue = max(revenue, 0)

                # --- 반올림 ---
                cost = round(cost, 2)
                revenue = round(revenue, 2)

                rows.append({
                    "date": date_str,
                    "channel": channel_name,
                    "campaign": campaign,
                    "cost": cost,
                    "impressions": impressions,
                    "clicks": clicks,
                    "conversions": conversions,
                    "revenue": revenue,
                })

    df = pd.DataFrame(rows)
    return df


def validate_data(df: pd.DataFrame) -> None:
    """생성된 데이터 검증"""
    print(f"총 행 수: {len(df)} (기대: 810)")
    assert len(df) == 810, f"행 수 불일치: {len(df)} != 810"

    print(f"컬럼: {list(df.columns)}")
    print(f"날짜 범위: {df['date'].min()} ~ {df['date'].max()}")
    print(f"채널: {df['channel'].unique().tolist()}")
    print(f"캠페인 수: {df['campaign'].nunique()}")
    print()

    # 채널별 평균 ROAS
    print("=== 채널별 평균 ROAS ===")
    for channel in df["channel"].unique():
        ch_data = df[df["channel"] == channel]
        roas = ch_data["revenue"].sum() / ch_data["cost"].sum()
        print(f"  {channel}: {roas:.2f}")

    print()

    # 결측치 확인
    print(f"결측치: {df.isnull().sum().sum()}")

    # 음수 확인
    for col in ["cost", "impressions", "clicks", "conversions", "revenue"]:
        assert (df[col] >= 0).all(), f"{col}에 음수 값 존재"

    print("\n✅ 데이터 검증 완료!")
    print("\n실무급 패턴 12가지 적용:")
    print("  1. 채널 효율성 차이")
    print("  2. 캠페인 효율성 차이")
    print("  3. 요일 효과")
    print("  4. 성장 트렌드 (+27%)")
    print("  5. 체감수익")
    print("  6. 블랙프라이데이 이벤트")
    print("  7. Facebook 추적 장애")
    print("  8. 광고 피로도 (Facebook)")
    print("  9. 경쟁사 이벤트 (Naver 11.11)")
    print("  10. 월말 예산 제약")
    print("  11. A/B 테스트 (Google)")
    print("  12. 계절성 (12월 연말)")


def main():
    """메인 실행"""
    print("=" * 70)
    print("마케팅 ROI 분석용 실무급 시뮬레이션 데이터 생성")
    print("=" * 70)
    print()

    df = generate_data()
    validate_data(df)

    # CSV 저장
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "marketing_raw_data.csv")

    # 기존 파일 백업
    if os.path.exists(output_path):
        backup_path = output_path.replace(".csv", "_backup.csv")
        os.rename(output_path, backup_path)
        print(f"\n기존 파일 백업: {backup_path}")

    df.to_csv(output_path, index=False, encoding="utf-8-sig")
    print(f"\nCSV 저장 완료: {output_path}")
    print(f"파일 크기: {os.path.getsize(output_path):,} bytes")


if __name__ == "__main__":
    main()
