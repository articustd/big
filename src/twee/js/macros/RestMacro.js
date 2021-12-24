Macro.add('restMacro', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }
        // Args: LevelUp - Boolean, Visible - Boolean

        let levelUp = this.args[0]
        let visible = this.args[1]
        let player = State.variables.player;

        if (!visible) {
            player.stats.hlth = player.stats.maxHlth;

            if (levelUp) {
                let leveled = false
                Object.entries(player.exp).forEach(([stat, value]) => {
                    if (value > 0) {
                        let statMap = statMapping(stat)
                        if (statMap.length == 1) {
                            player[statMap[0]] += value
                        }
                        if (statMap.length == 2) {
                            player[statMap[0]][statMap[1]] += value
                        }
                        player.exp[stat] = 0
                        
                        leveled = true
                    }
                });
                
                if(leveled) {
                    jQuery("levelUpText").addClass("text-fade-in").text("You feel the effects of your experience")
                }
            }
        }

        // let inventory = State.variables.player.inv;
        // let invText = ``

        // var invTable = document.createElement("table");
        // invTable.id = "invTable";
        // inventory.forEach(function (item, idx) {
        //     var row = invTable.insertRow(idx);
        //     let foundItem = getItemInfoByIndex(item.id)

        //     var nameCell = row.insertCell(0);
        //     var statCell = row.insertCell(1);
        //     var modCell = row.insertCell(2);
        //     var qtyCell = row.insertCell(3);
        //     var useCell = row.insertCell(4);

        //     nameCell.innerText = foundItem.name
        //     statCell.innerText = returnStatName(foundItem.stat)
        //     modCell.innerText = foundItem.mod
        //     qtyCell.innerText = item.qty
        //     $(useCell).append(`<a>Use</a>`).ariaClick(function (event) {
        //         if(isItemAvailable(item)) {
        //                 useItem(item.id);
        //                 invText = `Buffed ${returnStatName(foundItem.stat)} by ${foundItem.mod}`
        //                 decreaseInventory(item,idx);

        //                 state.display(state.active.title, null, "back")
        //         } else {
        //             invText = `${foundItem.name} is not in  inventory`
        //             state.display(state.active.title, null, "back")
        //         }
        //         jQuery("invText").text(invText)
        //     })
        // })
        // jQuery("invText").text(invText)
        // jQuery(this.output).append(invTable)
    }
})

function statMapping(stat) {
    switch (stat) {
        case 'muscle':
            return ['stats', 'strg']
        case 'fat':
            return ['measurements', 'weight']
        case 'size':
            return ['measurements', 'height']
        case 'skill':
            return ['skillPoints']
    }
}