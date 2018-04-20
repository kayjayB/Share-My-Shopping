let shoppingList = [];
let shoppingListCategory = [];

function addItem() {

    let item = document.getElementById("ShoppingListItem").value;
    let category = document.getElementById("ShoppingListCategory").value;
    
    // Check that an item has been added
    if(item.length == 0) {
        window.alert("Please enter an item to add to your list");
        return;
    }
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