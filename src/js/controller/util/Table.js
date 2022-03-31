import { createButton } from "@util/Input"
import { logger } from "./Logging"

export function createTable({ $parent, dataMap, data, name, btns: { hasDelete, hasAdd }, rowCallback }) {
    let $table = $(`<table/>`).attr('id', `${name}-table`).addClass('dataEditorTable')

    let $headerRow = $('<tr/>').appendTo($table)
    _.each(dataMap.children, (node) => {
        if (node.header)
            $headerRow.append($(`<th/>`).attr('id', `${node.propName}-column`).wiki(node.name))
    })

    if (hasDelete)
        $headerRow.append($(`<th/>`).attr('id', 'delete-column').css({ width: "35px" }))

    _.each(data, (d) => {
        addTableRow({
            $table,
            data: d,
            dataMap: dataMap.children,
            btns: { hasDelete },
            callback: rowCallback,
            name
        })
    })

    $parent.append($table)

    if (hasAdd)
        createButton({
            type: 'Add',
            icon: 'fa-plus',
            style: { "float": "right", "width": "35px", "border-radius": "5px", "margin-right": "3px" },
            callback: () => addTableRow({
                $table,
                data: hasAdd,
                dataMap: dataMap.children,
                btns: { hasDelete: true },
                callback: rowCallback,
                name
            })
        }).appendTo($parent)

    return $table
}

export function addTableRow({ $table, data, dataMap, name, btns: { hasDelete }, callback }) {
    let $row = $('<tr/>').addClass('dataRow').data(data)
    _.each(dataMap, (node) => {
        if (node.header) {
            // logger({node})
            let $dataCell = $('<td/>').attr('name',node.propName).wiki(data[node.propName])
            if(callback)
                $dataCell.addClass('dataCell').click(() => callback({ $table, $row, data: $row.data(), dataMap, name }))
            $row.append($dataCell)
        }
            
    })
    if (hasDelete)
        $row.append($('<td/>').append(createButton({
            type: 'Delete',
            icon: 'fa-times',
            style: { "border": "0px" },
            callback: () => { $row.remove() }
        })))
    $table.append($row)
}

export function updateRow({$row, data}) {
    $row.data(data)
    $('td', $row).each(function(){
        if($(this).attr('name')) {
            $(this).text('')
            $(this).wiki(data[$(this).attr('name')])
        }
    })
}