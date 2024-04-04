export function infoBubble(tooltipText) {
    return $('<span class="fa-stack fa-1x"><i class="fa fa-circle fa-stack-1x info info-back"></i><i class="fa fa-info fa-stack-1x info info-letter"></i> </span>').tooltip({ track: true, hide: { delay: 100 } }).attr('title', tooltipText)
}

// Expose to Twee files
window.infoBubble = infoBubble