from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.requests import AddressRequest
from dotenv import load_dotenv
import os
from tools.geocode import geocode
from tools.solar import fetch_solar_data
from tools.estimate import calculate_solar_potential
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from solarinsight-api!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/check_address")
async def check_address(body: AddressRequest):
    geocoded_data = await geocode(body.address)
    lat = geocoded_data["results"][0]["geometry"]["location"]["lat"]
    lng = geocoded_data["results"][0]["geometry"]["location"]["lng"]
    solar_data = await fetch_solar_data(lat, lng)
    solar_potential = calculate_solar_potential(solar_data, body.panel_count, body.monthly_bill, body.bill_is_pre_solar)
    return {
        "address": body.address,
        "solar_potential": solar_potential,
    }