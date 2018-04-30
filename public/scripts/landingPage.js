let shoppingList = [];
let shoppingListCategory = [];

$(document).ready(function () {
    $.ajax({
        url: "/items",
        type: "GET",
        contentType: "application/json",
        async: true,
        success: function (resp) {
            let nameArray = (resp);
            let names = nameArray.map(function (a) { return a.name; });
            let categories = nameArray.map(function (a) { return a.category; });

            for (let i = 0; i < names.length; i++){
                let item_name = names[i];
                let item_category = categories[i];
                addItem(item_name, item_category);
            }
        }
    });
});

function makeEditable(ID, value) {
    // make a field editable
    document.getElementById(ID).setAttribute("contenteditable", value)
}


function toggleButton() {
    // Check that text is added to the field before category can be added and item can be submitted
    let item = document.getElementById("ShoppingListItem").value;

    if(item.length == 0) {
        document.getElementById("SubmitButton").disabled = true;
        document.getElementById("ShoppingListCategory").disabled = true;
    }
    else {
        document.getElementById("SubmitButton").disabled = false;
        document.getElementById("ShoppingListCategory").disabled = false;
    }
}

function submitEditedItem(ID) {
    var index = parseInt(ID) + 1;       //make an integer so that it can be incremented
    var payload = {
        id: index.toString(),
        name: shoppingList[ID],
    };

    $.ajax({
        url: "/edititem",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        complete: function (data) {
            console.log(data.responseText);
        }
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
    document.getElementById(itemID).setAttribute("contenteditable", "false")
}

function submitChangesOnEnter(e, ID) {
    let enterKey = e.keyCode;
    if(enterKey === 13) 
    { 
        editItem(ID);
    }
}

function submitCategoryChangesOnEnter(e, ID) {
    let enterKey = e.keyCode;
    if(enterKey === 13) 
    { 
        editCategory(ID);
    }
}

function addItem(name, category) {

    let item_name = name;
    let item_category = category;

    if (item_name == "none"){
        item_name = document.getElementById("ShoppingListItem").value;
    }

    if (item_category == "none"){
        item_category = document.getElementById("ShoppingListCategory").value;
    }
 
    // Check that the category is not empty, if so assign a default value (This default is not added 
    // to the card but the arrays should still be the same lemgth)
    if (item_category == null){
        item_category = "None"
    }
    else if(item_category.length == 0) {
        item_category = "None"
    }

    shoppingList.push(item_name);
    shoppingListCategory.push(item_category);

    // Clear input text field once the item has been saved to the array
    document.getElementById("ShoppingListItem").value = "";
    document.getElementById("ShoppingListCategory").value = "";

    // Disable the button again for no input
    document.getElementById("SubmitButton").disabled = true;
    document.getElementById("ShoppingListCategory").disabled = true;

    // Get the element that will contain the cards
    let container = document.getElementById('list-container')

    // Remove all cards before re-adding new cards. 
    // This ensures that there are no duplicate cards
    // TODO: More efficient way to do this
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }

    for(let i = 0; i < shoppingList.length; i++){
        
        let cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.id = "list-entry_" + i.toString();
    
        let itemElement = document.createElement("h4");
        itemElement.id = "shoppingList_" + i.toString();

        itemElement.setAttribute("onmouseover", "makeEditable(id, true)");
        //itemElement.setAttribute("onmouseout", "makeEditable(id, false)")
        itemElement.setAttribute("onfocusout", "editItem(id)");
        itemElement.setAttribute("onkeydown", "submitChangesOnEnter(event, id)");
    
        let itemName = document.createTextNode(shoppingList[i]);
    
        let categoryElement = document.createElement("p2");
        categoryElement.id = "shoppingListCategory_" + i.toString();

        categoryElement.setAttribute("onmouseover", "makeEditable(id, true)");
        categoryElement.setAttribute("onfocusout", "editCategory(id)");
        categoryElement.setAttribute("onkeydown", "submitCategoryChangesOnEnter(event, id)");
    
        let categoryName = document.createTextNode(shoppingListCategory[i]);
    
        itemElement.appendChild(itemName);
        categoryElement.appendChild(categoryName);
    
        cardDiv.appendChild(itemElement);
        cardDiv.appendChild(categoryElement);
    
        container.appendChild(cardDiv);
    }
}

// allows user to submit an item on press of the enter button
function submitOnEnter(e) {
    if(e.keyCode === 13) { // makes sure that enter is the button being pressed
        storeItem();
        addItem('none','none');
    }
}

function storeItem() {
    var payload = {
        name: document.getElementById("ShoppingListItem").value,
        category: document.getElementById("ShoppingListCategory").value
    };

    $.ajax({
        url: "/items",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        complete: function (data) {
            console.log(data.responseText);
        }
    });

}