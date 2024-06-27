from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import pandas as pd
from analysis import router as analysis_router
from models import get_db, engine
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, world!"}


@app.post("/upload_data/")
def upload_data(file_path: str, db: Session = Depends(get_db)):
    data = pd.read_csv(file_path, parse_dates=['invoice_date'], encoding='latin1')
    data.columns = map(str.lower, data.columns)
    # Skip the first row (header) after reading
    data = data.iloc[1:]

    data.to_sql(name='purchases', con=engine, if_exists='append', index=False)
    return {"message": "Data uploaded successfully"}

# Include the imported API router
app.include_router(analysis_router, prefix="/analysis")