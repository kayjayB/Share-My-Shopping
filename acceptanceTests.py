from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time
import unittest
from selenium.webdriver.firefox.options import Options


class WebPageTesting(unittest.TestCase):
	def setUp(self):

		self.opts = Options()
		self.opts.set_headless()
		assert self.opts.headless  # operating in headless mode
		self.browser = webdriver.Chrome(options=self.opts)
		self.browser.get("http://127.0.0.1:3000")

	def test_add_item(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		assert self.browser.find_element_by_id("shoppingList_0").text == "Apple"

	def test_mark_as_completed(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		elem = self.browser.find_element_by_id('ShoppingListItem')
		elem.send_keys("Apple")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		elem2 = self.browser.find_element_by_id('purchaseStatus_0')
		assert elem2.is_selected() == False
		elem2.click()
		assert elem2.is_selected() == True

# Test that multiple items can be marked as completed
	def test_multiple_items_can_be_marked_as_completed(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()

		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("More Chocolate")
		button.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == False
		assert checkBox2.is_selected() == False

		checkBox.click()
		checkBox2.click()
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == True

# Test that one item can be marked as completed without changing the completion status of 
# the other items
	def test_one_item_can_be_marked_as_completed_in_isolation(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()

		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("More Chocolate")
		button.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == False
		assert checkBox2.is_selected() == False

		checkBox.click()
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == False

	# Test that the completion status of an item is stored and kept when the page is reloaded
	def test_completion_status_is_persistent(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBox.is_selected() == False
		checkBox.click()
		assert checkBox.is_selected() == True

		loadFromToken = self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys("0123456")
		button2 = self.browser.find_element_by_id('navigateToLink')
		button2.click()

		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBoxReloaded.is_selected() == True
		checkBoxReloaded.click()
		assert checkBoxReloaded.is_selected() == False

	# Test that the completion status of multiple items are stored and kept when the page is reloaded
	def test_completion_status_of_multiple_items_are_persistent(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Chocolate")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("More Chocolate")
		button.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBox.is_selected() == False
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox2.is_selected() == False
		checkBox.click()
		checkBox2.click()
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == True

		loadFromToken = self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys("0123456")
		button2 = self.browser.find_element_by_id('navigateToLink')
		button2.click()

		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		assert checkBoxReloaded.is_selected() == True
		checkBoxReloaded2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBoxReloaded2.is_selected() == True

# Test that the completion status of multiple items are stored and kept when the page is reloaded
	def test_completion_status_of_multiple_items_with_different_completion_statuses_are_persistent(self):
		delete = self.browser.find_element_by_id('deleteButton')
		delete.click()
		newItem = self.browser.find_element_by_id('ShoppingListItem')
		newItem.send_keys("Kit Kat")
		button = self.browser.find_element_by_id('SubmitButton')
		button.click()
		newItem2 = self.browser.find_element_by_id('ShoppingListItem')
		newItem2.send_keys("Bar One")
		button.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == False
		assert checkBox2.is_selected() == False
		checkBox.click()
		checkBox = self.browser.find_element_by_id('purchaseStatus_0')
		checkBox2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBox.is_selected() == True
		assert checkBox2.is_selected() == False

		loadFromToken = self.browser.find_element_by_id('viewListFromLink')
		loadFromToken.send_keys("0123456")
		button2 = self.browser.find_element_by_id('navigateToLink')
		button2.click()

		checkBoxReloaded = self.browser.find_element_by_id('purchaseStatus_0')
		checkBoxReloaded2 = self.browser.find_element_by_id('purchaseStatus_1')
		assert checkBoxReloaded.is_selected() == True
		assert checkBoxReloaded2.is_selected() == False

	def tearDown(self):
		self.browser.close()

if __name__ == "__main__":
	unittest.main()