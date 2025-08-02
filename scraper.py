from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from dataclasses import dataclass


@dataclass
class fragrance:
    site : str
    price : int
    ml : int
    url : str


def button_tap(driver):
    try:
        button = driver.find_element(By.XPATH, '//*[@id="L2AGLb"]/div')
        button.click()
        time.sleep(2)
    except:
        pass

def search_item(driver, fragrance, type, ml):
    try:
        ml = str(ml)
        frg = fragrance + ' ' + type + ' ' + ml + ' ' + 'ml'
        space_bar = driver.find_element(By.XPATH, '//*[@id="APjFqb"]')
        time.sleep(2)
        space_bar.send_keys(frg)
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
            item_link = item.find_element(By.CSS_SELECTOR, '.pla-unit-title-link').get_attribute('href')

            price = item_price.split(",")
            price = int(price[0])

            try:
                site = item_site.split(".")
                item_site = site[0]
            except:
                pass
            
            name_words = item_ml.split()
            ml = 0
            for word in name_words:
                try:
                    ml = int(word)
                except:
                    pass


            frg_list.append(fragrance(item_site, price, ml, item_link))
        except:
            pass

