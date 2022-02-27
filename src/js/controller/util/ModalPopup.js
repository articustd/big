export function popup() {
    let $modal = $('<div/>').dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        draggable: false,
        buttons: {
            "Yes": () => {$(this).dialog("close")}
        }
    })

    return $modal
}