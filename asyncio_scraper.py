import asyncio
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from urllib.parse import urlparse
import time
from selenium.webdriver.common.keys import Keys


def parse_deluxury(driver, fragrance):
    driver.get('https://deluxury.ro')
    button = driver.find_element(By.XPATH, '//*[@id="footer"]/div[3]/div[1]/div[7]/div[1]/a')
    button.click()
    space_bar = driver.find_element(By.XPATH, '//*[@id="search_widget"]/div/form/input[2]')
    time.sleep(2)
    space_bar.send_keys(fragrance)
    space_bar.send_keys(Keys.RETURN)
    time.sleep(3)


'''
async def main(fragrance):
    legit_sites = [
        'https://deluxury.ro',
        'https://esentedelux.ro', 
        'https://hiris.ro', 
        'https://vivantis.ro',
        'https://parfimo.ro', 
        'https://parfumuri-timisoara.ro',
        'https://parfumss.ro',
        'https://brasty.ro',
        'https://koku.ro',
        'https://zivada.ro',
        'https://makeup.ro',
        'https://evero.ro',
        'https://notino.ro', 
        'https://sephora.ro']


    options = uc.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    # Optional: options.add_argument('--headless')  # for headless mode

    # You do NOT need to provide a chromedriver path — uc manages that
    driver = uc.Chrome(options=options)


if __name__ == "__main__":
    asyncio.run(main("azzaro most wanted"))

'''

options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
# Optional: options.add_argument('--headless')  # for headless mode

# You do NOT need to provide a chromedriver path — uc manages that
driver = uc.Chrome(options=options)
fragrance = 'jpg le male'
parse_deluxury(driver, fragrance)
