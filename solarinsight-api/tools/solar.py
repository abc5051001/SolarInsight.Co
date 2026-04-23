import os
import httpx

async def fetch_solar_data(lat: float, lng: float) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://solar.googleapis.com/v1/buildingInsights:findClosest",
            params={
                "location.latitude": lat,
                "location.longitude": lng,
                "requiredQuality": "MEDIUM",
                "key": os.getenv("GOOGLE_CLOUD_API_KEY"),
            }
        )
        return response.json()