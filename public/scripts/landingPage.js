let shoppingList = [];

function addItem() {
    let item = document.getElementById("ShoppingListItem").value;
    shoppingList.push(item);
    console.log(shoppingList[0])
    document.getElementById("ShoppingListItem").value = "";
}