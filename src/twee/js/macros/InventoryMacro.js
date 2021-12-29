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
        
        let $table = $('<table/>');
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
                $row.append($('<td/>').wiki(r[0].mod))
                $row.append($('<td/>').wiki(r[1]))
                var $button = $(document.createElement('button')).wiki(`Use`).ariaClick(function (ev) {
                    let invText = ``
                    if(r[1] > 0) { // If the item is in inventory
                        useItem(r[0])
                        decreaseInventory(r[2],inventory)
                        invText = `Buffed ${returnStatName(r[0].stat)} by ${r[0].mod}`
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
            .addClass('item-table')
            .append($table)
            .appendTo(this.output);
    }
})

function useItem(usedItem) {
    if(usedItem.stat === 'hlth') { // This is a stop gap until I can put in prop health checking
        if(usedItem.mod + State.variables.player.stats.hlth > State.variables.player.stats.maxHlth) {
            State.variables.player.stats.hlth = State.variables.player.stats.maxHlth
            return
        }
    }
    State.variables.player[usedItem.type][usedItem.stat] += usedItem.mod
}

function decreaseInventory(idx,inv) {
    inv[idx].qty -= 1
    if(inv[idx].qty == 0)
        inv.splice(idx, 1)
}

function returnStatName(stat) {
    switch(stat) {
        case 'con':
            return 'Constitution'
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
        case 'agility':
            return 'Agility'
        case 'pawEye':
            return 'Paw-Eye Coordination'
        case 'skill':
            return 'Skill'
    }
}