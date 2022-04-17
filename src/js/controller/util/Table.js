import { createButton, createField } from "@util/Input"
import * as dataObjs from "@js/data"
import { logger } from "./Logging"

export function createTable({ $parent, dataMap, data, name, title, btns: { hasDelete, hasAdd }, rowCallback, dataCallback, editable }) {
    let $table = $(`<table/>`).attr('id', `${name}-table`).attr('name', name).addClass('dataEditorTable')

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
            rowCallback,
            dataCallback,
            editable,
            name
        })
    })

    if (title)
        $parent.append($('<span/>').wiki(title))
    $parent.append($table)

    if (hasAdd)
        createButton({
            type: 'Add',
            icon: 'fa-plus',
            style: { "float": "right", "width": "35px", "border-radius": "5px", "margin-right": "3px" },
            callback: function() {
                addTableRow({
                    $table,
                    data: hasAdd(dataMap),
                    dataMap: dataMap.children,
                    btns: { hasDelete: true },
                    rowCallback,
                    dataCallback,
                    editable,
                    name
                })
            }
        }).appendTo($parent)

    return $table
}

export function addTableRow({ $table, data, dataMap, name, btns: { hasDelete }, rowCallback, editable }) {
    let $row = $('<tr/>').addClass('dataRow').data(data)
    _.each(dataMap, ({ header, propName, type, field }) => {
        if (header) {
            let $dataCell = $('<td/>').attr('name', propName)
            if (rowCallback)
                $dataCell.addClass('dataCell').click(() => rowCallback({ $table, $row, data: $row.data(), dataMap, name }))

            if (editable)
                createField({
                    $parent: $dataCell,
                    type, field,
                    dataObj: dataObjs[field.data],
                    data: data[propName],
                    style: { wrapper: {}, input: { 'width': '93%' } },
                    callback: function (value) { $row.data()[propName] = value }
                })
            else
                $dataCell.wiki(data[propName])

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

export function updateRow({ $row, data }) {
    $row.data(data)
    $('td', $row).each(function () {
        if ($(this).attr('name')) {
            $(this).text('')
            $(this).wiki(data[$(this).attr('name')])
        }
    })
}