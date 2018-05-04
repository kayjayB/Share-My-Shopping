from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
import time
import unittest


class WebPageTesting(unittest.TestCase):
	def setUp(self):
		chrome_options = Options()
		#chrome_options.add_argument("--headless")
		self.browser = webdriver.Chrome("/Users/KJ/Documents/Work_2018/Software Development/Group-7-Lab/chromedriver",options=chrome_options)
		self.browser.get("http://127.0.0.1:3000")

	def test_add_item(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingList_0").text == "Apple"

	def test_mark_as_completed(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		elem2 = self.browser.find_element_by_id('purchaseStatus_0')
		assert elem2.is_selected() == False
		elem2.click()
		assert elem2.is_selected() == True

# Test that one item can be marked as completed without changing the completion status of 
# the other items
	def test_one_item_can_be_marked_as_completed_in_isolation(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)

		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("More Chocolate")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button.click()
		time.sleep(0.1)

		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')

		assert checkBox.is_selected() == False
		assert checkBox2.is_selected() == False

		checkBox.click()
		time.sleep(0.1)
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == False

	# Test that the completion status of an item is stored and kept when the page is reloaded
	def test_completion_status_is_persistent(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBox.is_selected() == False
		checkBox.click()
		time.sleep(0.1)
		assert checkBox.is_selected() == True

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')
		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()

		time.sleep(0.1)
		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBoxReloaded.is_selected() == True
		checkBoxReloaded.click()
		time.sleep(0.1)
		assert checkBoxReloaded.is_selected() == False

	# Test that the completion status of multiple items are stored and kept when the page is reloaded
	def test_completion_status_of_multiple_items_are_persistent(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("More Chocolate")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button.click()
		time.sleep(0.1)
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBox.is_selected() == False
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox2.is_selected() == False
		checkBox.click()
		time.sleep(0.1)
		checkBox2.click()
		time.sleep(0.1)
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == True

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')
		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()

		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBoxReloaded.is_selected() == True
		checkBoxReloaded2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBoxReloaded2.is_selected() == True

# Test that the completion status of multiple items are stored and kept when the page is reloaded
	def test_completion_status_of_multiple_items_with_different_completion_statuses_are_persistent(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		time.sleep(0.1)
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Kit Kat")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("Bar One")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button.click()
		time.sleep(0.1)
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == False
		assert checkBox2.is_selected() == False
		checkBox.click()
		time.sleep(0.1)
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == False

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')
		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()

		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		checkBoxReloaded2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBoxReloaded.is_selected() == True
		assert checkBoxReloaded2.is_selected() == False

	def test_add_item_quantity(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingListQuantity_0").text == "123"

	def test_add_item_quantity_and_verify_that_quantity_is_stored_in_database_and_rendered_on_page_after_reload(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')
		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingListQuantity_0").text == "123"

	def test_add_item_quantity_for_multiple_items(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Perterdeeeeeeers")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(1234)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')

		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingListQuantity_0").text == "123"
		assert self.browser.find_element_by_id("shoppingListQuantity_1").text == "1234"

	def test_add_item_quantity_for_multiple_items_and_verify_that_quantity_is_stored_in_database_and_rendered_on_page_after_reload(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Perterdeeeeeeers")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(1234)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingListQuantity_0").text == "123"
		assert self.browser.find_element_by_id("shoppingListQuantity_1").text == "1234"

		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')

		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()

		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingListQuantity_0").text == "123"
		assert self.browser.find_element_by_id("shoppingListQuantity_1").text == "1234"

	def test_add_two_shopping_lists(self):
		remove_overlay = self.browser.find_element_by_id("CreateListButton")
		remove_overlay.click()
		delete = self.browser.find_element_by_id('deleteButton')
		delete.send_keys("\n")
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(123)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Perterdeeeeeeers")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(1234)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		self.browser.find_element_by_id('shareDropdown').click()
		token = self.browser.find_element_by_id('sharingLink').get_attribute('value')

		remove_overlay = self.browser.find_element_by_id("createList")
		remove_overlay.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple2")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(238049)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Perterdeeeeeeers2")
		quant = self.browser.find_element_by_id('ShoppingListQuantity')
		quant.send_keys(7896)
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()

		self.browser.find_element_by_id('loadList').click()
		loadFromToken= self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys(token)
		self.browser.find_element_by_id('navigateToLink').click()
		
		time.sleep(0.1)
		assert self.browser.find_element_by_id("shoppingList_0").text == "Apple"
		assert self.browser.find_element_by_id("shoppingList_1").text == "Perterdeeeeeeers"

	def tearDown(self):
		self.browser.close()

if __name__ == "__main__":
	unittest.main()