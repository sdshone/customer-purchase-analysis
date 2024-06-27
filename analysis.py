from models import Purchase, get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
import pandas as pd


router = APIRouter()
# Set the display format for float values
pd.options.display.float_format = '{:.2f}'.format

@router.get("/customer_segmentation/")
def customer_segmentation(db: Session = Depends(get_db)):

    data = db.query(Purchase.customer_id, Purchase.unit_price, Purchase.quantity).all()

        
    df = pd.DataFrame(data, columns=["customer_id", "unit_price", "quantity"])
    df['total_purchase'] = df.groupby('customer_id')['unit_price'].transform('sum')
    df['purchase_count'] = df.groupby('customer_id')['quantity'].transform('count')
    # Drop rows with any `NaN` values
    df = df.dropna()

    segments = df.drop_duplicates(subset=['customer_id']).to_dict(orient='records')
    return {"customer_segments": segments}
