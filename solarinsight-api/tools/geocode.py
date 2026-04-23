import os
import httpx

async def geocode(address: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": address, "key": os.getenv("GOOGLE_CLOUD_API_KEY")},
        )
        return response.json()