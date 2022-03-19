const { logger } = require("@util/Logging");

Macro.add('restMessageMacro', {
    skipArgs: false,
    handler: function () {
        let home = this.args[0]
        let player = variables().player;
        let maxFull = getFullPercentage(player.capacity)
        let $messageDiv = $('<div/>')
        let message;
        if (home) {
            if (maxFull >= 0.9)
                message = `You're about to burst, you will attract attention unless you rest!.`
            if (maxFull < 0.9)
                message = `You're so full, if you don't rest you might attract too much attention.`
            if (maxFull < 0.5)
                message = `You're pretty full, wouldn't be a bad idea to sleep a bit.`
            if (maxFull < 0.25)
                message = `You're a little full, maybe take a nap.`
            if (maxFull == 0)
                message = null
        } else {
            if (maxFull >= 0.9)
                message = `''You're ripe for the picking and could be attacked at any moment! Get home and rest asap!''`
            if (maxFull < 0.9)
                message = `You're so full, eyes are starting to fall on you. Propably should go home and rest.`
            if (maxFull < 0.5)
                message = `You're pretty full, resting at home might be a good idea soon.`
            if (maxFull < 0.25)
                message = `You're a little full, maybe take a nap when you get back home.`
            if (maxFull == 0)
                message = null
        }

        if (message) {
            $messageDiv.wiki(message).prepend($('<br/>')).appendTo(this.output)
        }
    }
})

function getFullPercentage(capacity) {
    let maxCap = 0
    _.each(capacity, (val, key) => {
        if (!key.includes('Max'))
            maxCap = (capacity[key] / capacity[key + 'Max'] > maxCap) ? (capacity[key] / capacity[key + 'Max']) : maxCap
    })
    return maxCap
}