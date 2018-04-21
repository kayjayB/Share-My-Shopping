let shoppingList = [];
let shoppingListCategory = [];

function toggleButton() {

    // Check that an item has been added
    let item = document.getElementById("ShoppingListItem").value;

    if(item.length == 0) {
        document.getElementById("SubmitButton").disabled = true;
    }
    else {
        document.getElementById("SubmitButton").disabled = false;
    }
}


function addItem() {

    let item = document.getElementById("ShoppingListItem").value;
    let category = document.getElementById("ShoppingListCategory").value;
    

 
    // Check that the category is not empty, if so assign a default value
    if(category.length == 0) {
        category = " "
    }

    shoppingList.push(item);
    shoppingListCategory.push(category);

    console.log("Category added:" + shoppingListCategory[0]);

    // Clear input text field once the item has been saved to the array
    document.getElementById("ShoppingListItem").value = "";
    document.getElementById("ShoppingListCategory").value = "";

    // Disable the button again for no input
    document.getElementById("SubmitButton").disabled = true;

    // Get the element that will contain the cards
    let container = document.getElementById('list-container')

    // Remove all cards before re-adding new cards. 
    // This ensures that there are no duplicate cards
    // TODO: More efficient way to do this
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }

    // Create the cards and append the card to the parent element
    let cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.id = "list-entry";

    let headerElement = document.createElement("h4");
    headerElement.id = "shoppingList";

    let headerText = document.createTextNode(shoppingList[0]);

    headerElement.appendChild(headerText);

    cardDiv.appendChild(headerElement);

    container.appendChild(cardDiv);
}