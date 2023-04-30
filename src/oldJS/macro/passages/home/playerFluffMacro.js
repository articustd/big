import { findMuscle, findFat, findBreastSize } from '@controller/character/MeasurementController'
import { logger } from '@util/Logging'

Macro.add('playerFluffMacro', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()
        logger({player})
        let $wrapper = $('<span/>')
        let $general = $('<span/>')
        let $upperBody = $('<span/>')
        let $lowerBody = $('<span/>')
        let $allAround = $('<span/>')

        let { muscleGut } = findMuscle(player)
        let { showAbs } = Object.values(findFat(player.measurements.bodyFat))[0]

        $general
            .wiki(`Your ?pSize ?pHeight frame is supporting ?pMuscleSingular ?pMuscle amount of muscles and ?pFatSingular ?pFat amount of body fat. With your muscles and fat, your total weight comes out to ?pWeight.`)
            .append('<br><br>')

        $upperBody
            .wiki(`Your chest sports ${getBreastText(player)}?pMusclePecs pectoral muscles. Looking at your arms, ?pMuscleArms. With your ?pMuscle amount of muscles, your arms ?pMuscleArmsSecond. Looking down at your stomach ${checkAbs(showAbs, muscleGut)}.`)
            .append('<br><br>')

        $lowerBody
            .wiki(`Your eyes and paws work their way down to explore below your waist. ${collectGenitals(player)}`)
            .append('<br><br>')

        $allAround
            .wiki(`All around you are a ?pSize looking ?pSpecies.`)

        $wrapper
            .append($general)
            .append($upperBody)
            .append($lowerBody)
            .append($allAround)
            .appendTo(this.output)
    }
})

function getBreastText({ gender: { breasts } }) {
    return breasts ? `?pBreast cup breasts and ` : ''
}

function collectGenitals({ gender: { penis, balls, vagina } }) {
    if (penis)
        penis = `You take your ?pPenis sized member in your paw. `
    if (balls) {
        balls = `Slowly moving your paws down to your ?pBalls sized orbs you roll them around and emit a small purr of approval. `
        if (penis)
            balls = `Underneath your ?pPenis member you roll your ?pBalls sized testicles in your paws. `
    }
    if (vagina) {
        vagina = `You find a pert vagina. Taking your fingers you spread your wet lips and slip one in. A moan escapes your muzzle and you snap back to reality as you pull your paw away.`
        if (penis)
            vagina = `Lifting up your ?pPenis sized member you find a pert vagina. `
        if (balls)
            vagina = `Lifting up your ?pBalls sized orbs you find a pert vagina. `
    }

    return `${penis || ''}${balls || ''}${vagina || ''}`
}

function checkAbs(showAbs, muscleGut) {
    if (!showAbs && muscleGut)
        return `you see a ?pFat muscle gut`
    return `?pFatStomach` + (showAbs ? ` ?pMuscleAbs` : ``)
}