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

    t.equal(sizeArray, 1);
    t.end();
});