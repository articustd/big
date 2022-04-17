export function infoBubble(tooltipText) {
    return $('<i class="fa fa-info-circle" aria-hidden="true"/>').tooltip({ track: true, hide: { delay: 100 } }).attr('title', tooltipText)
}

// Expose to Twee files
window.infoBubble = infoBubble