let shoppingList = [];
let shoppingListCategory = [];

function toggleButton() {

    // Check that text is added to the field before it can be submitted
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
 
    // Check that the category is not empty, if so assign a default value (This default is not added 
    // to the card but the arrays should still be the same lemgth)
    if(category.length == 0) {
        category = " "
    }

    shoppingList.push(item);
    shoppingListCategory.push(category);

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

    for(let i =0; i < shoppingList.length; i++){
        let cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.id = "list-entry";
    
        let headerElement = document.createElement("h4");
        headerElement.id = "shoppingList";
    
        let headerText = document.createTextNode(shoppingList[i]);
    
        let paragraphElement = document.createElement("p2");
        paragraphElement.id = "shoppingListCategory";
    
        let paragraphText = document.createTextNode(shoppingListCategory[i]);
    
        headerElement.appendChild(headerText);
        paragraphElement.appendChild(paragraphText);
    
        cardDiv.appendChild(headerElement);
        cardDiv.appendChild(paragraphElement);
    
        container.appendChild(cardDiv);
    }
}