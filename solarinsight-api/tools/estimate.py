ELECTRICITY_RATES = {
    "VA": 0.135,
    "MD": 0.145,
    "DC": 0.145,
}

INFLATION_RATE = 0.03  # electricity prices rise ~3%/yr historically

def calculate_solar_potential(
    solar_data: dict,
    panel_count: int,
    monthly_bill: int = None,
    bill_is_pre_solar: bool = True,
) -> dict:
    state    = solar_data["administrativeArea"]
    analyses = solar_data["solarPotential"]["financialAnalyses"]
    configs  = solar_data["solarPotential"]["solarPanelConfigs"]

    if monthly_bill and bill_is_pre_solar:
        valid    = [a for a in analyses if "financialDetails" in a]
        scenario = min(valid, key=lambda a: abs(int(a["monthlyBill"]["units"]) - monthly_bill))
        electricity_rate = monthly_bill / scenario["averageKwhPerMonth"]
    else:
        electricity_rate = ELECTRICITY_RATES.get(state, 0.135)

    matching   = next((c for c in configs if c["panelsCount"] == panel_count), None)
    annual_kwh = matching["yearlyEnergyDcKwh"] if matching else 0

    soiling_kwh_lost    = annual_kwh * 0.20
    soiling_dollar_lost = soiling_kwh_lost * electricity_rate

    # Year-by-year soiling cost compounded with electricity inflation
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
        "electricity_rate":      round(electricity_rate, 4),
        "rate_source":           "user_bill" if (monthly_bill and bill_is_pre_solar) else "regional_average",
        "soiling_kwh_lost":      round(soiling_kwh_lost, 2),
        "soiling_dollar_lost":   round(soiling_dollar_lost, 2),
        "yearly_soiling":        yearly_soiling,
        "lifetime_soiling_usd":  lifetime_soiling_usd,
        "recommended_cleanings": recommended_cleanings,
        "cleaning_cost":         cleaning_cost,
        "cleaning_roi":          cleaning_roi,
    }
