import { addToInventory, decreaseCredits, getItemInfoByIndex } from "@controller/character/ItemController";
import { logger } from "@util/Logging"

Macro.add('storeItem', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }
        var storeStock = this.args[0].stock;
        
        let $table = $('<div/>').addClass('grid store-grid');
        let $wrapper = $('<span/>')
        let tableData = [['Item','Description','Quantity','Price', '', '']]
        storeStock.forEach(function (item, idx) {
            tableData.push([item.id,item.qty,item.price, idx])
        })

        $.each(tableData, function(rowIndex,r) {
            if (rowIndex > 0) {
                $table.append(
                    $('<div/>')
                    .wiki(getItemInfoByIndex(r[0]).name)
                    .addClass('store-item-name')
                )
                $table.append(
                    $('<div/>')
                    .wiki(getItemInfoByIndex(r[0]).desc)
                    .addClass('store-item-description')
                )
                $table.append(
                    $('<div/>')
                    .wiki(r[1] + "x")
                    .addClass('store-item-quantity')
                )
                $table.append(
                    $('<div/>')
                    .wiki(r[2] + "<<iconMacro 'credits' 'inline-icon light-text'>>")
                    .addClass('store-item-price')
                )
                //Single buy button
                var $button = $(document.createElement('button'))
                    .wiki(`Buy`)
                    .addClass('full-width')
                    .ariaClick(function (ev) {
                    let storeText = ``
                    if(r[1] > 0) { // If the item is in stock
                        if(State.variables.player.credits >= r[2]) { // Can the player afford it
                            BuyItem(r, storeStock)
                            storeText = `Bought 1 ${getItemInfoByIndex(r[0]).name}!`
                        } else
                            storeText = `Not enough credits for ${getItemInfoByIndex(r[0]).name}`
                        
                    } else
                        storeText = `${getItemInfoByIndex(r[0]).name} is not in stock`
                    
                    State.variables.storeText = storeText
                    Engine.play(passage(), true)
                })
                $table.append($(`<div/>`).addClass('store-item-buy-single').append($button))

                //Max buy button
                var $MaxButton = $(document.createElement('button'))
                    .wiki(`Buy max`)
                    .addClass('full-width')
                    .ariaClick(function (ev) {
                    let storeText = ``
                    let SuccessCount = 0
                    //console.log(r[1])
                    if(r[1] > 0) { // If the item is in stock
                        for(let x = 0; x < r[1]; x++){
                            if(State.variables.player.credits >= r[2]) { // Can the player afford it
                                BuyItem(r, storeStock)
                                SuccessCount++;
                            } 
                        }  
                        storeText = `Bought ` + SuccessCount + ` ${getItemInfoByIndex(r[0]).name}(s)`                                        
                    } 
                    
                    else {
                        storeText = `${getItemInfoByIndex(r[0]).name} is not in stock`
                    }                    
                    State.variables.storeText = storeText
                    Engine.play(passage(), true)
                })


                $table.append($(`<div/>`).addClass('store-item-buy-max').append($MaxButton))
                $table.append($('<hr/>'))
            } else {
                $.each(r, function(colIndex, c) {
                    $table.append($(`<div/>`).wiki(c).addClass('grid-header'))
                })
            }
        })

        $wrapper
            .attr('id', `macro-${this.name}`)
            .append($table)
            .appendTo(this.output);
    }
})

function decreaseStock(id,storeStock) {
    storeStock[id].qty -= 1
}

function BuyItem(r, storeStock){
    addToInventory({id:r[0],qty:1})
    decreaseCredits(r[2])
    decreaseStock(r[3],storeStock)
}