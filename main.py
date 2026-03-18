from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import random

app = FastAPI()

# Endpoint: Generate a random multiplication problem.
@app.get("/number")
async def get_number():
    n1 = random.randint(0, 12)
    n2 = random.randint(0, 12)
    return {"n1": n1, "n2": n2}

# Returns the two factors and the correct product.   
@app.get("/product")  
async def get_product(n1: int, n2: int):
    return {"product": n1 * n2}

app.mount("/", StaticFiles(directory="static", html=True), name="static")