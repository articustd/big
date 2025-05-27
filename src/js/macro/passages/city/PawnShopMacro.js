import { addToInventory, decreaseCredits, getItemInfoByIndex, decreaseInventory, sellItem } from "@controller/character/ItemController";
import { logger } from "@util/Logging"

Macro.add('pawnShopMacro', {
    skipArgs: false,
    handler: function () {
        let { inv: storeStock } = variables().player;

        let $table = $('<div/>').addClass('grid store-grid');
        let $wrapper = $('<span/>')
        let tableData = [['Item', 'Description', 'Quantity', 'Price', '', '']]
        storeStock.forEach(function (item, idx) {
            tableData.push([item.id, item.qty, idx])
        })

        $.each(tableData, function (rowIndex, r) {
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
                        .wiki(getPawnPrice(r[0]) + " <<iconMacro 'credits' 'inline-icon light-text'>>")
                        .addClass('store-item-price')
                )
                //Single sell button
                var $button = $(document.createElement('button'))
                    .wiki(`Sell`)
                    .addClass('full-width')
                    .ariaClick(function (ev) {
                        let pawnText = ``
                        if (r[1] > 0) { // Double check the player has the item to sell
                            // Sell item to the pawn shop
                            sellItem(r[2], variables().player, getPawnPrice(r[0]))
                            // Report result to pawnText
                            pawnText = `Sold 1 ${getItemInfoByIndex(r[0]).name} for ${getPawnPrice(r[0]) * 1} <<iconMacro 'credits' 'inline-icon light-text'>>`
                        } else // If somehow the player gets a sell button, but item is no longer in their inventory
                            pawnText = `You don't have any ${getItemInfoByIndex(r[0]).name} to sell.`

                        State.variables.storeText = pawnText
                        Engine.play(passage(), true)
                    })
                $table.append($(`<div/>`).addClass('store-item-buy-single').append($button))

                //Max sell button
                var $MaxButton = $(document.createElement('button'))
                    .wiki(`Sell Max`)
                    .addClass('full-width')
                    .ariaClick(function (ev) {
                        let pawnText = ``
                        //console.log(r[1])
                        if (r[1] > 0) { // Double check the player has the item to sell
                            // Sell all of the item to the pawn shop
                            sellItem(r[2], variables().player, getPawnPrice(r[0]), r[1])
                            // Report result to pawnText
                            pawnText = `Sold ${r[1]} ${getItemInfoByIndex(r[0]).name} for a total of ${(getPawnPrice(r[0]) * r[1])} <<iconMacro 'credits' 'inline-icon light-text'>>`
                        } else // If somehow the player gets a sell button, but item is no longer in their inventory
                            pawnText = `${getItemInfoByIndex(r[0]).name} is not in stock`

                        State.variables.storeText = pawnText
                        Engine.play(passage(), true)
                    })


                $table.append($(`<div/>`).addClass('store-item-buy-max').append($MaxButton))
                $table.append($('<hr/>'))
            } else {
                $.each(r, function (colIndex, c) {
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

function decreaseStock(id, storeStock) {
    storeStock[id].qty -= 1
}

function BuyItem(r, storeStock) {
    addToInventory({ id: r[0], qty: 1 })
    decreaseCredits(r[2])
    decreaseStock(r[3], storeStock)
}

function getPawnPrice(itemId) {
    let price = getItemInfoByIndex(itemId).basePrice
    price = _.floor((price / 4) * 3)
    return price
}