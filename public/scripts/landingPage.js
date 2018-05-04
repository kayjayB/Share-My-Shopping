let shoppingList = [];
let shoppingListCategory = [];
let shoppingListQuantity = [];
// var token = 0123456;

$(document).ready(function() {
    document.getElementById("viewListFromLink").value = "";
});


function makeEditable(ID, value) {
    // make a field editable
    document.getElementById(ID).setAttribute("contenteditable", value)
}

function toggleButton() {
    // Check that text is added to the field before category can be added and item can be submitted
    let item = document.getElementById("ShoppingListItem").value;

    if (item.length == 0) {
        document.getElementById("SubmitButton").disabled = true;
        document.getElementById("ShoppingListCategory").disabled = true;
        document.getElementById("ShoppingListQuantity").disabled = true;
    } else {
        document.getElementById("SubmitButton").disabled = false;
        document.getElementById("ShoppingListCategory").disabled = false;
        document.getElementById("ShoppingListQuantity").disabled = false;
    }
}

function submitEditedItem(ID) {
    var index = parseInt(ID) + 1; //make an integer so that it can be incremented
    var payload = {
        id: index.toString(),
        name: shoppingList[ID],
        category: shoppingListCategory[ID],
    };

    $.ajax({
        url: "/edititem",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        complete: function(data) {}
    });
}

function editItem(itemID) {

    let ID = itemID.toString().split("_")[1];
    shoppingList[ID] = document.getElementById(itemID.toString()).innerHTML;

    submitEditedItem(ID);
    document.getElementById(itemID).setAttribute("contenteditable", "false")
}

function editCategory(itemID) {

    let ID = itemID.toString().split("_")[1];
    shoppingListCategory[ID] = document.getElementById(itemID.toString()).innerHTML;
    submitEditedItem(ID);
    document.getElementById(itemID).setAttribute("contenteditable", "false")
}

function submitNameChangesOnEnter(e, ID) {
    let enterKey = 13;
    if (e.keyCode === enterKey) {
        editItem(ID);
    }
}

function submitCategoryChangesOnEnter(e, ID) {
    let enterKey = 13;
    if (e.keyCode === enterKey) {
        editCategory(ID);
    }
}

// allows user to submit an item on press of the enter button
function saveItemOnEnter(e) {
    let enterKey = 13;
    if (e.keyCode === enterKey) { // makes sure that enter is the button being pressed
        storeItem();
        addItem('none', 'none', 0);
    }
}

function addItem(name, category, quantity) {

    let item_name = name;
    let item_category = category;
    let item_quantity = quantity;

    if (item_name == "none") {
        item_name = document.getElementById("ShoppingListItem").value;
    }

    if (item_category == "none") {
        item_category = document.getElementById("ShoppingListCategory").value;
    }

    if (item_quantity === 0) {
        item_quantity = document.getElementById("ShoppingListQuantity").value;
    }

    // Check that the category is not empty, if so assign a default value (This default is not added 
    // to the card but the arrays should still be the same lemgth)
    if (item_category == null) {
        item_category = "Category/Aisle";
    } else if (item_category.length == 0) {
        item_category = "Category/Aisle";
    }

    if (item_quantity == null) {
        item_quantity = 1;
    } else if (item_quantity.length == 0) {
        item_quantity = 1;
    }

    shoppingList.push(item_name);
    shoppingListCategory.push(item_category);
    shoppingListQuantity.push(item_quantity);

    // Clear input text field once the item has been saved to the array
    document.getElementById("ShoppingListItem").value = "";
    document.getElementById("ShoppingListCategory").value = "";
    document.getElementById("ShoppingListQuantity").value = "";

    // Disable the button again for no input
    document.getElementById("SubmitButton").disabled = true;
    document.getElementById("ShoppingListCategory").disabled = true;
    document.getElementById("ShoppingListQuantity").disabled = true;

    // Get the element that will contain the cards
    let container = document.getElementById('list-container')

    // Remove all cards before re-adding new cards. 
    // This ensures that there are no duplicate cards
    // TODO: More efficient way to do this
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }

    for (let i = 0; i < shoppingList.length; i++) {

        let cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.id = "list-entry_" + i.toString();

        let itemElement = document.createElement("span");
        itemElement.id = "shoppingList_" + i.toString();
        itemElement.className = "shoppingListItem";

        itemElement.setAttribute("onmouseover", "makeEditable(id, true)");
        itemElement.setAttribute("onfocusout", "editItem(id)");
        itemElement.setAttribute("onkeydown", "submitNameChangesOnEnter(event, id)");

        let itemName = document.createTextNode(shoppingList[i]);

        let categoryElement = document.createElement("h4");
        categoryElement.id = "shoppingListCategory_" + i.toString();

        categoryElement.setAttribute("onmouseover", "makeEditable(id, true)");
        categoryElement.setAttribute("onfocusout", "editCategory(id)");
        categoryElement.setAttribute("onkeydown", "submitCategoryChangesOnEnter(event, id)");

        let categoryName = document.createTextNode(shoppingListCategory[i]);

        let quantityElement = document.createElement("span");
        quantityElement.id = "shoppingListQuantity_" + i.toString();
        quantityElement.className = "shoppingListQuantity";
        let quantityAmount = document.createTextNode(shoppingListQuantity[i]);
        let quantityMultiplier = document.createElement("span");
        quantityMultiplier.className = "multiplier";
        let quantityText = document.createTextNode("X");

        itemElement.appendChild(itemName);
        categoryElement.appendChild(categoryName);
        quantityElement.appendChild(quantityAmount);
        quantityMultiplier.appendChild(quantityText);

        cardDiv.appendChild(itemElement);
        cardDiv.appendChild(quantityMultiplier);
        cardDiv.appendChild(quantityElement);
        cardDiv.appendChild(categoryElement);

        container.appendChild(cardDiv);
    }
}

function storeItem() {
    var payload = {
        name: document.getElementById("ShoppingListItem").value,
        category: document.getElementById("ShoppingListCategory").value,
        quantity: document.getElementById("ShoppingListQuantity").value,
        token: "0123456", // Must be changed when multiple lists are added
    };
    console.log(payload);
    $.ajax({
        url: "/items",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        complete: function(data) {
            console.log(data.responseText);
        }
    });

}

// set the length of the string
var stringLength = 15;

// list containing characters for the random string
var stringArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '?'];

function generateToken() {

    var randomString = "";

    // build a string with random characters
    for (var i = 1; i < stringLength; i++) {
        var randomNumber = Math.ceil(Math.random() * stringArray.length) - 1;
        randomString = randomString + stringArray[randomNumber];
    }
    return randomString;
}

function printURL(tokenDB) {
    let linkContainer = document.getElementById('sharingLink');
    while (linkContainer.hasChildNodes()) {
        linkContainer.removeChild(linkContainer.firstChild);
    }

    let resultURL = tokenDB;
    document.getElementById("sharingLink").value = resultURL;

}

function getToken() {
    $.ajax({
        url: "/token",
        type: "GET",
        contentType: "application/json",
        async: true,
        success: function(resp) {
            let tokenArray = (resp);
            let token = tokenArray.map(function(a) { return a.token; });
            if (token[0] === undefined)
                printURL(""); // Print empty string
            else
                printURL(token[0]); // Only the first token is needed since all tokens in the list are the same
        }
    });
}

function copyLink() {
    var copyText = document.getElementById("sharingLink");
    copyText.select();
    document.execCommand("Copy");
    //alert("Copied the text: " + copyText.value);
}

function toggleLinkSubmit() {
    var link = document.getElementById("viewListFromLink").value;

    if (link.length === 0) {
        document.getElementById("navigateToLink").disabled = true;
    } else
        document.getElementById("navigateToLink").disabled = false;
}

function viewList() {
    var link = document.getElementById("viewListFromLink").value;

    if (link.match(/^[0-9]+$/) != null) {

        removeList();
        console.log(link);
        $.ajax({
            url: "/items/" + link.toString(),
            type: "GET",
            contentType: "application/json",
            async: true,
            success: function(resp) {
                let nameArray = (resp);
                let names = nameArray.map(function(a) { return a.name; });
                let categories = nameArray.map(function(a) { return a.category; });
                let quantities = nameArray.map(function (a) { return a.quantity; });
                if (names.length === 0) {
                    alert("No shopping list found");
                    document.getElementById("viewListFromLink").value = "";
                } else if (names.length !== 0) {
                    removeList();
                    for (let i = 0; i < names.length; i++) {
                        let item_name = names[i];
                        let item_category = categories[i];
                        let item_quantity = quantities[i];
                        addItem(item_name, item_category, item_quantity);
                    }
                    document.getElementById("viewListFromLink").value = "";
                }
            }
        });

    } else {
        alert("Token should only contain numbers");
        document.getElementById("viewListFromLink").value = "";
    }
}

function removeList() {
    let listContainer = document.getElementById('list-container')
    shoppingList = [];
    shoppingListCategory = [];
    while (listContainer.hasChildNodes()) {
        listContainer.removeChild(listContainer.firstChild);
        console.log("removing");
    }
}