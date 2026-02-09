# Changelog - Marketing ROI Optimization

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com).

## [2026-02-10] - PDCA GAS Automation Restructuring & Roadmap Integration

### Added
- PDCA completion report for "automation" feature (docs/04-report/features/automation.report.md)
- Unified execution roadmap document (analysis/report/action_roadmap.md)
  - Immediate actions (Week 1): Naver budget increase, ROAS thresholds, monitoring
  - Short-term actions (Month 1): Facebook CAPI, Google targeting automation, 180-day data
  - Medium-term actions (Month 3+): SARIMAX modeling, Guard Rail automation, Causal Impact
  - Guard Rail specifications: ROAS floor (1.8), CPA ceiling ($25), daily budget limit ($150)
  - Scenario-based actions: Conservative/Base/Optimistic strategies

### Changed
- Project structure: 9 GAS files moved from root to `automation/` folder
- File organization: Code.gs, Config.gs, Attribution.gs, Report.gs, Setup.gs, Tests.gs, appsscript.json, auth guides
- .clasp.json rootDir: explicitly set to `"automation"` for clarity
- Documentation paths: Updated in README.md, CLAUDE.md, executive_summary.md, .github/workflows/validate.yml
- CHANGELOG.md: Added v0.8.0 entry for automation structure improvements

### Reorganized
- automation/: New centralized folder for all GAS scripts and related documentation
- automation/Code.gs: Main API collection and data pipeline logic
- automation/Attribution.gs: Multi-touch attribution (5 models) and funnel analysis
- automation/Report.gs: Anomaly detection (Z-score) and weekly reporting
- automation/Tests.gs: 30 unit test cases for business logic validation
- automation/auth_setup_instructions.md: Google/Facebook OAuth setup guide
- automation/naver_setup_guide.md: Naver Search Ads API integration guide

### Fixed
- [Major] validate.yml: Updated path from `*.gs` to `automation/*.gs` for correct CI checks
- [Major] CHANGELOG.md: Added v0.8.0 entry documenting automation structure changes
- [Minor] .claude/ configuration files: Updated 5 memory files with correct automation/ paths

### Quality Metrics (Automation Feature)
- Design-Implementation Match Rate: **95%** (target: ≥90%) ✅
- File reorganization: 9/9 files moved (100%)
- Documentation updates: 8/8 documents path-corrected (100%)
- Roadmap document completeness: 95% (3 time horizons + Guard Rail + scenarios)
- Gap analysis iterations: 1 (78% → 95% in single improvement cycle)

---

## [2026-02-10] - PDCA Analysis Feature Completion

### Added
- PDCA completion report for "analysis" feature (docs/04-report/analysis.report.md)
- 6-axis portfolio quality assessment framework
- Gap analysis validation (91% match rate)
- 4 gap fixes with complete documentation
- A/B test power analysis and MDE calculation
- 3-scenario analysis with Guard Rail mechanism
- Dashboard PNG/PDF export functionality
- Advanced Analysis notebook with ARIMA/A/B testing
- SQL cross-validation notebook for budget optimization

### Changed
- README.md: Complete refactoring with analysis framework diagram
- MarketingROI_Analysis.ipynb: 5 findings → 7 findings in conclusion
- executive_summary.md: USD ($) → KRW (₩) currency conversion
- Dashboard: Added KRW formatting and export buttons
- Notebook structure: Enhanced with markdown insights and bridging narratives

### Improved
- Project structure clarity: 3 notebooks clearly separated (Basic/Advanced/SQL)
- Storytelling quality: 6.8/10 → 8.8/10 (+2.0 improvement)
- Methodology rigor: All 12 analytical methods fully implemented
- Business narrative: Quantified impact (₩2,600만 additional revenue)
- Technical evidence: 3 notebooks + 15 charts + interactive dashboard
- Execution roadmap: Immediate/short-term/medium-term 3-stage plan

### Fixed
- [Major] Main notebook conclusion: 5 findings → 7 findings (added A/B test, scenario)
- [Major] Currency inconsistency: executive_summary USD → KRW (1300 rate)
- [Minor] Chart list: 10 items → 15 items (included Advanced Analysis charts)
- [Minor] File count: README "13 charts" → "15 charts"

### Verified
- 7/7 key findings: 100% code evidence match
- 5/5 budget optimization proposals: 100% implementation
- 15/15 charts: Complete set generated and referenced
- 13/13 dashboard features: All working correctly
- 0 code errors: Both notebooks execute cleanly

### Quality Metrics
- Design-Implementation Match Rate: **91%** (target: ≥90%) ✅
- Overall Quality Score: **8.8/10** (up from 6.8/10, +29% improvement)
- Code Execution: 0 errors, 39+20 cells verified
- Documentation: 100% JSDoc + markdown insights
- Reproducibility: seed=42 fixed, identical results guaranteed

### Performance
- Analysis: 3 notebooks (Basic 39 cells, Advanced 20 cells, SQL validation)
- Visualization: 15 PNG charts (200 DPI) + interactive Chart.js dashboard
- Processing: Python pandas/scipy + Supabase PostgreSQL (cross-validation)
- Automation: Google Apps Script (30 unit tests)

---

## [2026-01] - Initial Portfolio Assessment

### Added
- Executive summary report with 7 key findings
- Scenario analysis framework (Conservative/Base/Optimistic)
- Naver Ads ROAS superiority analysis
- Brand campaign performance validation
- Attribution model comparison (5 models)
- Funnel analysis for CTR/CVR bottlenecks
- ARIMA forecasting with ADF stationarity test
- Tableau Public dashboard (public version)
- GAS automation with Z-score anomaly detection

### Infrastructure
- Marketing data collection: Google/Facebook/Naver Ads API
- Spreadsheet automation: 30 unit tests in Tests.gs
- Slack notifications: Real-time anomaly alerts
- Weekly reports: WoW performance comparison

---

## [2025-12] - Data Analysis Foundation

### Added
- 3-channel marketing dataset (Google, Facebook, Naver Ads)
- 90-day data simulation (realistic marketing patterns)
- Chart.js interactive dashboard with Vercel deployment
- PDF export functionality via jsPDF

### Analysis
- EDA: Channel/campaign/weekday analysis
- Statistical: ANOVA significance testing (p<0.001)
- Regression: Linear/log/polynomial models with 5-fold CV
- Optimization: ROAS-weighted budget reallocation (+4.3%)
- Anomalies: 14 outliers detected via Z-score

---

## [2024-10-01] - Project Initiation

### Created
- Project structure: analysis/, dashboard/, docs/
- Data collection scripts: generate_data.py
- Core notebooks: MarketingROI_Analysis.ipynb
- Configuration: requirements.txt, auth setup guides

---

## Related Documents

- **PDCA Completion Report**: [docs/04-report/analysis.report.md](./analysis.report.md)
- **Gap Analysis**: [docs/03-analysis/analysis.analysis.md](../03-analysis/analysis.analysis.md)
- **Executive Summary**: [analysis/report/executive_summary.md](../../analysis/report/executive_summary.md)
- **README**: [README.md](../../README.md)
