from pydantic import BaseModel
from typing import Optional

class AddressRequest(BaseModel):
    address: str
    panel_count: int
    monthly_bill: Optional[int] = None
    bill_is_pre_solar: bool = True
