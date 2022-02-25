Macro.add('invMacro', {
    skipArgs: false,
    handler: function () {
        let inventory = State.variables.player.inv;
        
        let $table = $('<table/>').addClass('inventoryTable');
        let $wrapper = $('<span/>')
        let tableData = [['Item','Stat','Modifier','Quantity']]
        inventory.forEach(function (item, idx) {
            tableData.push([getItemInfoByIndex(item.id), item.qty, idx])
        })

        $.each(tableData, function(rowIndex,r) {
            var $row = $('<tr/>')
            if (rowIndex > 0) {
                $row.append($('<td/>').wiki(r[0].name))
                $row.append($('<td/>').wiki(returnStatName(r[0].stat)))
                $row.append($('<td/>').wiki((r[0].mod % 1 == 0)?r[0].mod:r[0].mod*100))
                $row.append($('<td/>').wiki(r[1]))
                var $button = $(document.createElement('button')).wiki(`Use`).ariaClick(function (ev) {
                    let invText = ``
                    if(r[1] > 0) { // If the item is in inventory
                        if(useItem(r[0])) {
                            decreaseInventory(r[2],inventory)
                            invText = `Buffed ${returnStatName(r[0].stat)} by ${r[0].mod}`
                        } else
                            invText = `Health is already full`                        
                    } else {
                        invText = `${r[0].name} is not in  inventory`
                    }
                    State.variables.invText = invText
                    Engine.play(passage(), true)
                })
                $row.append($(`<td/>`).append($button))
            } else {
                $.each(r, function(colIndex, c) {
                    $row.append($(`<th/>`).wiki(c))
                })
            }
            $table.append($row)
        })

        $wrapper
            .attr('id', `macro-${this.name}`)
            .append($table)
            .appendTo(this.output);
    }
})

function useItem(usedItem) {
    if(usedItem.stat === 'hlth') { // HACK This is a stop gap until I can put in prop health checking... this might not be a stop gap anymore
        if(usedItem.mod + State.variables.player.stats.hlth > State.variables.player.stats.maxHlth) {
            State.variables.player.stats.hlth = State.variables.player.stats.maxHlth
            return false
        }
    }
    State.variables.player[usedItem.type][usedItem.stat] += usedItem.mod
    State.variables.player.stats.maxHlth = getMaxHealth(State.variables.player)
    return true
}

function decreaseInventory(idx,inv) {
    inv[idx].qty -= 1
    if(inv[idx].qty == 0)
        inv.splice(idx, 1)
}