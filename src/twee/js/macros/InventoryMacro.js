Macro.add('invMacro', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }

        let inventory = State.variables.player.inv;
        let invText = ``
        
        var invTable = document.createElement("table");
        invTable.id = "invTable";

        var header = invTable.insertRow(0)
        var nameHeader = header.insertCell(0);
        var statHeader = header.insertCell(1);
        var modHeader = header.insertCell(2);
        var qtyHeader = header.insertCell(3);

        nameHeader.innerText = `Item`
        statHeader.innerText = `Stat`
        modHeader.innerText = `Modifier`
        qtyHeader.innerText = `Quantity`

        inventory.forEach(function (item, idx) {
            var row = invTable.insertRow(idx+1);
            let foundItem = getItemInfoByIndex(item.id)

            var nameCell = row.insertCell(0);
            var statCell = row.insertCell(1);
            var modCell = row.insertCell(2);
            var qtyCell = row.insertCell(3);
            var useCell = row.insertCell(4);

            nameCell.innerText = foundItem.name
            statCell.innerText = returnStatName(foundItem.stat)
            modCell.innerText = foundItem.mod
            qtyCell.innerText = item.qty
            $(useCell).append(`<a>Use</a>`).ariaClick(function (event) {
                if(isItemAvailable(item)) {
                        useItem(item.id);
                        invText = `Buffed ${returnStatName(foundItem.stat)} by ${foundItem.mod}`
                        decreaseInventory(item,idx);
                        
                        state.display(state.active.title, null, "back")
                } else {
                    invText = `${foundItem.name} is not in  inventory`
                    state.display(state.active.title, null, "back")
                }
                jQuery("invText").text(invText)
            })
        })
        jQuery("invText").text(invText)
        jQuery(this.output).append(invTable)
    }
})

function isItemAvailable(item) {
    return item.qty > 0 ? true : false
}

function useItem(item) {
    console.log(item)
    let usedItem = getItemInfoByIndex(item);
    console.log(usedItem)
    State.variables.player[usedItem.type][usedItem.stat] += usedItem.mod
}

function decreaseInventory(item, idx) {
    item.qty -= 1;
}

function returnStatName(stat) {
    switch(stat) {
        case 'maxHlth':
            return 'Max Health'
        case 'hlth':
            return 'Health'
        case 'strg':
            return 'Strength'
        case 'def':
            return 'Defense'
        case 'acc':
            return 'Accuracy'
        case 'dex':
            return 'Dexterity'
        case 'muscle':
            return 'Muscle'
        case 'fat':
            return 'Fat'
        case 'size':
            return 'Size'
    }
}