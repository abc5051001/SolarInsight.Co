from pydantic import BaseModel
from typing import Optional

class AddressRequest(BaseModel):
    address: str
    panel_count: int
    electricity_rate: Optional[float] = None
