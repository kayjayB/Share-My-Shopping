from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import unittest


class WebPageTesting(unittest.TestCase):
	def setUp(self):
		self.browser = webdriver.Chrome()
		self.browser.get("http://127.0.0.1:3000")

	def test_add_item(self):
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(5)
		assert self.browser.find_element_by_id("shoppingList_0").text == "Apple"

	def tearDown(self):
		self.browser.close()

if __name__ == "__main__":
	unittest.main()