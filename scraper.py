import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from dataclasses import dataclass
from typing import List

@dataclass
class fragrance:
    site : str
    price : int
    ml : str


def button_tap(driver):
    try:
        button = driver.find_element(By.XPATH, '//*[@id="L2AGLb"]/div')
        button.click()
        time.sleep(2)
    except:
        pass

def search_item(driver):
    fragrance = "azzaro most wanted"
    try:
        space_bar = driver.find_element(By.XPATH, '//*[@id="APjFqb"]')
        time.sleep(2)
        space_bar.send_keys(fragrance)
        space_bar.send_keys(Keys.RETURN)
        time.sleep(3)
    except:
        print("Search bar not found.")

def crawl_prices_and_sites(driver, frg_list):
    
    #item_list = driver.find_elements(By.CLASS_NAME, 'Ez5pwe')
    time.sleep(1)
    item_list = driver.find_elements(By.CSS_SELECTOR, '.mnr-c')
    prices_and_site = []


    for item in item_list:
        try:
            item_price = item.find_element(By.CSS_SELECTOR, '.T4OwTb .e10twf').text
            item_site = item.find_element(By.CSS_SELECTOR, '.LbUacb .zPEcBd').text
            item_ml = item.find_element(By.CSS_SELECTOR, '.pla-unit-title-link').text
            
            price = item_price.split(",")
            price = int(price[0])
            
            name_words = item_ml.split()
            ml = ' '
            for word in name_words:
                try:
                    ml = int(word)
                except:
                    pass

            if ml == ' ':
                ml = '-'

            frg_list.append(fragrance(item_site, price, ml))
        except:
            pass


legit_sites = ['Notino', 'Sephora', 'Deluxury', 'Hiris', 'Vivantis', 'Obsentum',
               'Parfimo', 'Parfumss', 'Brasty', 'Koku', 'Zivada', 'Makeup', 'Evero']

# Setup undetected Chrome
options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
# Optional: options.add_argument('--headless')  # for headless mode

# You do NOT need to provide a chromedriver path — uc manages that
try:
    with uc.Chrome(use_subprocess=True) as driver:
        # Open Google Shopping
        url = "https://www.google.com"
        driver.get(url)

        button_tap(driver)
        search_item(driver)
        frg_list : List[fragrance] = []
        crawl_prices_and_sites(driver, frg_list)

        for item in frg_list:
            print(item.site, item.price, item.ml, sep=' ')
except Exception as e:
    print(f"An error occurred: {e}")