let shoppingList = [];

function addItem() {

    let item = document.getElementById("ShoppingListItem").value;

    shoppingList.push(item);

    // Clear input text field once the item has been saved to the array
    document.getElementById("ShoppingListItem").value = "";

    document.getElementById("shoppingList").innerHTML = shoppingList[0];

}