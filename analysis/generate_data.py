"""
마케팅 ROI 분석용 현실적 데이터 생성기

90일 x 3채널 x 3캠페인 = 810행의 마케팅 데이터를 생성합니다.
순수 랜덤이 아닌 발견 가능한 패턴이 내장되어 있습니다:

내장 패턴:
1. 채널 효율성 차이: Naver ROAS ~3.2 > Google ~2.8 > Facebook ~2.0
2. 캠페인 차이: Brand > Retargeting > Generic/Interest
3. 요일 효과: Google/Naver 주중 강세, Facebook 주말 강세
4. 성장 트렌드: 90일간 +27% 점진적 성장
5. 체감수익: 고예산 → ROAS 하락 (로그 곡선)
6. 블랙프라이데이: 11/28-12/1 전 채널 매출 3배
7. FB 추적장애: 12/18-19 Facebook만 전환 급락
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
        "base_cost": [150, 300, 100],       # 캠페인별 일 기본 광고비
        "base_roas": [3.5, 2.2, 3.0],       # 캠페인별 기본 ROAS
        "ctr": [0.08, 0.03, 0.06],          # 클릭률
        "cvr": [0.05, 0.02, 0.04],          # 전환율
        "weekday_boost": 1.15,               # 주중 부스트
        "weekend_boost": 0.80,               # 주말 감소
    },
    "Facebook Ads": {
        "campaigns": ["FB_Interest", "FB_Lookalike", "FB_Retargeting"],
        "base_cost": [200, 250, 120],
        "base_roas": [1.8, 2.0, 2.5],
        "ctr": [0.04, 0.035, 0.055],
        "cvr": [0.025, 0.03, 0.04],
        "weekday_boost": 0.90,               # 주중 감소
        "weekend_boost": 1.25,               # 주말 부스트
    },
    "Naver Ads": {
        "campaigns": ["Naver_Brand", "Naver_Shopping", "Naver_Retargeting"],
        "base_cost": [120, 280, 80],
        "base_roas": [4.0, 2.8, 3.5],
        "ctr": [0.07, 0.04, 0.065],
        "cvr": [0.06, 0.03, 0.05],
        "weekday_boost": 1.20,               # 주중 부스트
        "weekend_boost": 0.75,               # 주말 감소
    },
}

# 블랙프라이데이 기간 (11/28 ~ 12/1)
BLACK_FRIDAY_START = datetime(2024, 11, 28)
BLACK_FRIDAY_END = datetime(2024, 12, 1)

# Facebook 추적 장애 기간 (12/18 ~ 12/19)
FB_TRACKING_FAILURE_START = datetime(2024, 12, 18)
FB_TRACKING_FAILURE_END = datetime(2024, 12, 19)


def get_growth_factor(day_index: int) -> float:
    """90일간 +27% 성장 트렌드 (점진적 선형 성장)"""
    return 1.0 + (0.27 * day_index / (NUM_DAYS - 1))


def get_weekday_factor(date: datetime, channel_config: dict) -> float:
    """요일 효과: 주중(월~금) vs 주말(토~일) 부스트"""
    if date.weekday() < 5:  # 월~금
        return channel_config["weekday_boost"]
    else:  # 토~일
        return channel_config["weekend_boost"]


def get_diminishing_returns(cost: float, base_cost: float) -> float:
    """체감수익: 광고비가 기본 대비 높을수록 ROAS 하락 (로그 곡선)"""
    ratio = cost / base_cost
    if ratio <= 1.0:
        return 1.0
    return 1.0 / (1.0 + 0.15 * np.log(ratio))


def is_black_friday(date: datetime) -> bool:
    """블랙프라이데이 기간 여부"""
    return BLACK_FRIDAY_START <= date <= BLACK_FRIDAY_END


def is_fb_tracking_failure(date: datetime, channel: str) -> bool:
    """Facebook 추적 장애 기간 여부"""
    return (channel == "Facebook Ads" and
            FB_TRACKING_FAILURE_START <= date <= FB_TRACKING_FAILURE_END)


def generate_data() -> pd.DataFrame:
    """전체 마케팅 데이터 생성"""
    rows = []

    for day_index in range(NUM_DAYS):
        date = START_DATE + timedelta(days=day_index)
        date_str = date.strftime("%Y-%m-%d")
        growth = get_growth_factor(day_index)

        for channel_name, config in CHANNELS.items():
            weekday_factor = get_weekday_factor(date, config)

            for camp_idx in range(3):
                campaign = config["campaigns"][camp_idx]
                base_cost = config["base_cost"][camp_idx]
                base_roas = config["base_roas"][camp_idx]
                ctr = config["ctr"][camp_idx]
                cvr = config["cvr"][camp_idx]

                # --- 광고비 계산 ---
                cost_noise = np.random.normal(1.0, 0.12)
                cost = base_cost * growth * weekday_factor * cost_noise

                # 블랙프라이데이: 광고비 1.5배 증액
                if is_black_friday(date):
                    cost *= 1.5

                cost = max(cost, 10)  # 최소 $10

                # --- 노출수 계산 ---
                cpm = np.random.uniform(8, 15)  # CPM $8~$15
                impressions = int(cost / cpm * 1000 * np.random.normal(1.0, 0.08))
                impressions = max(impressions, 100)

                # --- 클릭수 계산 ---
                actual_ctr = ctr * np.random.normal(1.0, 0.10)
                clicks = int(impressions * actual_ctr)
                clicks = max(clicks, 1)

                # --- 전환수 계산 ---
                actual_cvr = cvr * growth * np.random.normal(1.0, 0.15)
                conversions = int(clicks * actual_cvr)

                # Facebook 추적 장애: 전환 80% 누락
                if is_fb_tracking_failure(date, channel_name):
                    conversions = max(int(conversions * 0.2), 0)

                conversions = max(conversions, 0)

                # --- 매출 계산 ---
                # 체감수익 적용
                diminishing = get_diminishing_returns(cost, base_cost)
                effective_roas = base_roas * diminishing

                # 블랙프라이데이: 매출 3배
                if is_black_friday(date):
                    effective_roas *= 2.0  # 광고비도 1.5배 → 총 매출 약 3배

                revenue = cost * effective_roas * np.random.normal(1.0, 0.10)

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

    print("\n데이터 검증 완료!")


def main():
    """메인 실행"""
    print("마케팅 ROI 분석용 데이터 생성 중...\n")

    df = generate_data()
    validate_data(df)

    # CSV 저장
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "marketing_raw_data.csv")

    df.to_csv(output_path, index=False, encoding="utf-8-sig")
    print(f"\nCSV 저장 완료: {output_path}")
    print(f"파일 크기: {os.path.getsize(output_path):,} bytes")


if __name__ == "__main__":
    main()
