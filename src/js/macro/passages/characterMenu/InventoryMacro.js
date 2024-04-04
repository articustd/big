import { checkNewCapacity } from "@controller/character/CapacityController";
import { getMaxHealth, returnStatName } from "@controller/character/CharacterController";
import { getItemInfoByIndex } from "@controller/character/ItemController"

Macro.add('invMacro', {
    skipArgs: false,
    handler: function () {
        let inventory = State.variables.player.inv;
        
        let $table = $('<table/>').addClass('inventoryTable');
        let $wrapper = $('<span/>')
        let tableData = [['Item','Description','Quantity','','']]
        inventory.forEach(function (item, idx) {
            tableData.push([getItemInfoByIndex(item.id), item.qty, idx])
        })

        $.each(tableData, function(rowIndex,r) {
            var $row = $('<tr/>')
            if (rowIndex > 0) {
                $row.append($('<td/>').wiki(r[0].name))
                $row.append($('<td/>').wiki((r[0].desc)))
                $row.append($('<td/>').wiki(r[1])) //Quantity
                
                //Single use button 
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
                
                //Max use button
                var $MaxButton = $(document.createElement('button')).wiki(`Use All`).ariaClick(function (ev) {
                    let invText = ``
                    let SuccessCount = 0
                    //console.log(r[1])
                    if(r[1] > 0) { // If the item is in inventory
                        for(let x = 0; x < r[1]; x++){
                            let ItemUsed = useItem(r[0]);
                            //console.log(ItemUsed)
                            if(ItemUsed) {
                                decreaseInventory(r[2],inventory);
                                SuccessCount++;
                            } 
                        }  
                        invText = `Used ` + SuccessCount + ` ${r[0].name}(s) and buffed ${returnStatName(r[0].stat)} by ${r[0].mod * SuccessCount}`                                        
                    } 
                    
                    else {
                        invText = `${r[0].name} is not in  inventory`
                    }                    
                    State.variables.invText = invText
                    Engine.play(passage(), true)
                })
                $row.append($(`<td/>`).append($MaxButton))

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
    let {player} = variables()

    //Prevents overhealing if item heals, consolidated from two IF statements
    if(usedItem.stat === 'hlth' && usedItem.mod + player.stats.hlth > player.stats.maxHlth) { 
        player.stats.hlth = player.stats.maxHlth
        return false
    }

    if(usedItem.stat === 'size') {
        player.measurements.height += usedItem.mod
        return true
    }

    player[usedItem.type][usedItem.stat] += usedItem.mod
    player.stats.maxHlth = getMaxHealth(player)
    checkNewCapacity(player)
    return true
}

function decreaseInventory(idx,inv) {
    inv[idx].qty -= 1
    if(inv[idx].qty == 0)
        inv.splice(idx, 1)
}