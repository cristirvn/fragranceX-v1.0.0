from scraper import fragrance, button_tap, search_item, crawl_prices_and_sites
from typing import List
import undetected_chromedriver as uc
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Data model for the request body
class FragranceRequest(BaseModel):
    name: str

legit_sites = ['Notino', 'Sephora', 'Deluxury', 'Hiris', 'Vivantis', 'Obsentum',
               'Parfimo', 'Parfumss', 'Brasty', 'Koku', 'Zivada', 'Makeup', 'Evero']

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware to allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The API endpoint that triggers the scraping
@app.post("/scrape")
async def get_best_price(request: FragranceRequest):
    
    # Setup undetected Chrome
    options = uc.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--headless")
    # Optional: options.add_argument('--headless')  # for headless mode

    # You do NOT need to provide a chromedriver path — uc manages that
    driver = uc.Chrome(use_subprocess=True) 
    # Open Google Shopping
    url = "https://www.google.com"
    driver.get(url)

    button_tap(driver)
    search_item(driver, request.name)
    frg_list : List[fragrance] = []

    crawl_prices_and_sites(driver, frg_list)

    driver.quit()

    frg_list = [item for item in frg_list if item.site in legit_sites]
    frg_list = [item for item in frg_list if item.ml >= 100]

    final_result = 0
    predefined_price = 10000000000
    for item in frg_list:
        if item.price < predefined_price:
            final_result = item
            predefined_price = item.price
    if final_result:
            return {"price": final_result.price, "site": final_result.site, "ml": final_result.ml}
    else:
            return {"message": "No results found."}