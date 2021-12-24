Macro.add('storeItem', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }

        let storeStock = this.args[0].stock;
        let storeText = ``
        
        var stockTable = document.createElement("table");
        stockTable.id = "storeStockTable";

        var header = stockTable.insertRow(0)
        var nameHeader = header.insertCell(0);
        var qtyHeader = header.insertCell(1);
        var priceHeader = header.insertCell(2);

        nameHeader.innerText = `Item`
        qtyHeader.innerText = `Quantity`
        priceHeader.innerText = `Price`

        storeStock.forEach(function (item, idx) {
            var row = stockTable.insertRow(idx+1);

            var nameCell = row.insertCell(0);
            var qtyCell = row.insertCell(1);
            var priceCell = row.insertCell(2);
            var buyCell = row.insertCell(3);

            nameCell.innerText = getItemInfoByIndex(item.id).name
            qtyCell.innerText = item.qty
            priceCell.innerText = item.price
            $(buyCell).append(`<a>Buy</a>`).ariaClick(function (event) {
                if(isItemInStock(item)) {
                    if(canAfford(item)) {
                        addToInventory(item.id);
                        decreaseMoney(item.price);
                        decreaseStock(item);
                        storeText = `Bought 1 ${getItemInfoByIndex(item.id).name}!`
                        state.display(state.active.title, null, "back")
                    } else {
                        storeText = `Not enough credits for ${getItemInfoByIndex(item.id).name}`
                    }
                } else {
                    storeText = `${getItemInfoByIndex(item.id).name} is not in stock`
                }
                jQuery("storeText").text(storeText)
            })
        })
        jQuery("storeText").text(storeText)
        jQuery(this.output).append(stockTable)
    }
})

function isItemInStock(item){
    return item.qty > 0 ? true : false
}

function canAfford(item){
    return State.variables.player.money >= item.price ? true : false
}

function decreaseStock(item) {
    item.qty--;
}