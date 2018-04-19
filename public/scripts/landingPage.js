let shoppingList = [];

function addItem() {

    let item = document.getElementById("ShoppingListItem").value;

    shoppingList.push(item);

    // Clear input text field once the item has been saved to the array
    document.getElementById("ShoppingListItem").value = "";

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