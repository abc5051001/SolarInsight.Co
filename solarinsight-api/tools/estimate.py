ELECTRICITY_RATES = {
    "VA": 0.135,
    "MD": 0.145,
    "DC": 0.145,
}

INFLATION_RATE = 0.056  # Arlington/NoVA avg: ~24% rise over 4 years (2020-2024)
SOILING_RATE   = 0.20   # Northern Virginia: heavy pollen + summer dust

def calculate_solar_potential(
    solar_data: dict,
    panel_count: int,
    electricity_rate: float = None,
) -> dict:
    state   = solar_data["administrativeArea"]
    configs = solar_data["solarPotential"]["solarPanelConfigs"]

    if electricity_rate:
        rate        = electricity_rate
        rate_source = "user_rate"
    else:
        rate        = ELECTRICITY_RATES.get(state, 0.135)
        rate_source = "regional_average"

    matching    = next((c for c in configs if c["panelsCount"] == panel_count), None)
    panels_note = None
    if matching is None:
        matching    = min(configs, key=lambda c: abs(c["panelsCount"] - panel_count))
        panels_note = (
            f"No exact data for {panel_count} panel{'s' if panel_count != 1 else ''}. "
            f"Estimate based on the closest available configuration ({matching['panelsCount']} panels)."
        )
    annual_kwh = matching["yearlyEnergyDcKwh"] if matching else 0

    soiling_kwh_lost    = annual_kwh * SOILING_RATE
    soiling_dollar_lost = round(soiling_kwh_lost * rate, 2)

    yearly_soiling = [
        round(soiling_dollar_lost * (1 + INFLATION_RATE) ** year, 2)
        for year in range(20)
    ]
    lifetime_soiling_usd = round(sum(yearly_soiling), 2)

    recommended_cleanings = 2 if soiling_dollar_lost > 450 else 1
    cleaning_cost = recommended_cleanings * 225
    cleaning_roi  = round(soiling_dollar_lost - cleaning_cost, 2)
    system_kw     = panel_count * 400 / 1000

    return {
        "system_kw":             round(system_kw, 2),
        "annual_kwh":            round(annual_kwh, 2),
        "electricity_rate":      round(rate, 4),
        "rate_source":           rate_source,
        "soiling_rate":          SOILING_RATE,
        "soiling_kwh_lost":      round(soiling_kwh_lost, 2),
        "soiling_dollar_lost":   soiling_dollar_lost,
        "yearly_soiling":        yearly_soiling,
        "lifetime_soiling_usd":  lifetime_soiling_usd,
        "recommended_cleanings": recommended_cleanings,
        "cleaning_cost":         cleaning_cost,
        "cleaning_roi":          cleaning_roi,
        "panels_note":           panels_note,
    }
