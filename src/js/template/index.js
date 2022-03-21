const { logger } = require("@util/Logging")

Template.add(['pSpecies','PSpecies'], function() {
    return this.name === 'pSpecies' ? _.toLower(variables().player.species) : variables().player.species
})