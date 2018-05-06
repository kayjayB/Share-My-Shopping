"use strict";
let test = require("tape");

test("Hello World: hello should greet the world", function(t) {
    let hello = "world";
    t.equal(hello, "world");
    t.end();
});

test("An empty shopping list has a length of 0", function(t) {
    let item = "First Item";
    let shoppingList = [];

    let sizeArray = shoppingList.length;

    t.equal(sizeArray, 0);
    t.end();
});

test("Adding a shopping list item to an empty list increases the size of the list to 1", function(t) {
    let item = "First Item";
    let shoppingList = [];

    shoppingList.push(item);
    let sizeArray = shoppingList.length;
    let expectedSize = 1;
    t.equal(sizeArray, expectedSize);
    t.end();
});

test("When an item is added to a shopping list, the  original item is equal to the item in the shopping list", function(t) {
    let item = "First Item";
    let shoppingList = [];

    shoppingList.push(item);

    t.equal(shoppingList[0], item);
    t.end();
});

test("An empty category list has a length of 0", function(t) {
    let item = "First Category";
    let shoppingListCategory = [];

    let numElements = shoppingListCategory.length;
    let emptySize = 0;

    t.equal(numElements, emptySize);
    t.end();
});

test("Adding a category to an empty category list increases the size of the list to 1", function(t) {
    let category = "First Category";
    let shoppingListCategory = [];

    shoppingListCategory.push(category);
    let numElements = shoppingListCategory.length;
    let expectedSize = 1;
    t.equal(numElements, expectedSize);
    t.end();
});

test("When a category is added to the list, the category is equal to the fist category in the list", function(t) {
    let category = "First Category";
    let shoppingListCategory = [];

    shoppingListCategory.push(category);

    t.equal(shoppingListCategory[0], category);
    t.end();
});

test("Adding two items to an empty list increases the size of the list to 2", function(t) {
    let item1 = "First Item";
    let item2 = "Second Item";
    let shoppingList= [];

    shoppingList.push(item1);
    shoppingList.push(item2);
    let numElements = shoppingList.length;
    let expectedSize = 2;
    t.equal(numElements, expectedSize);
    t.end();
});

test("Deleting an item from the list reduces the list's size by 1", function(t) {
    let item1 = "First Item";
    let item2 = "Second Item";
    let shoppingList= [];

    shoppingList.push(item1);
    shoppingList.push(item2);
    let numElements = shoppingList.length;
    let expectedSize = 2;
    shoppingList.splice(0, 1);
    let decreasedSize = shoppingList.length;
    t.equal(expectedSize - 1, decreasedSize);
    t.end();
});