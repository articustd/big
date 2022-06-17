import { species } from "@js/data"
import { logger } from "@util/Logging"

Macro.add('GenWingMacro', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()
        let cost = 0
        let $speciesContainer = $('<div/>')

        let $dropdown = $('<select name="species"/>')

        _.each(species, (type) => {
            $dropdown.append($('<option/>').attr('value', type).prop('selected', player.species === type).wiki(type))
        })

        $speciesContainer.append($('<label for="species"/>').wiki('Species: '))
        $speciesContainer.append($dropdown)

        let $genitalContainer = $('<div/>').css({ display: 'flex', 'flex-direction': 'column' })

        $genitalContainer.append($('<h3/>').wiki('Gentials'))
        let $penisContainer = $('<div/>').appendTo($genitalContainer)
        
        $penisContainer.append($('<span/>').wiki('Penis: ?PPenis <i class="fa fa-arrow-right"/> ?PPenis'))
        let $pControls = $('<div/>').appendTo($penisContainer)
        $pControls.append($('<button/>').append($('<i/>').addClass(`fa fa-minus`)))
        $pControls.append(createDropdown({'1':1,'10':10},'penisValue'))
        $pControls.append($('<button/>').append($('<i/>').addClass(`fa fa-plus`)))

        let $testiContainer = $('<div/>').appendTo($genitalContainer)
        $testiContainer.append($('<span/>').wiki('Testicals: PBalls <i class="fa fa-arrow-right"/> 100'))
        let $tControls = $('<div/>').appendTo($testiContainer)
        $tControls.append($('<button/>').append($('<i/>').addClass(`fa fa-minus`)))
        $tControls.append(createDropdown({'1':1,'10':10},'testiValue'))
        $tControls.append($('<button/>').append($('<i/>').addClass(`fa fa-plus`)))

        let $vaginaContainer = $('<div/>').appendTo($genitalContainer)
        $vaginaContainer.append($('<span/>').wiki('Vagina: '))
        let vaginaDropdown = createDropdown({'false':'Removed', 'true':'Equipped'}, 'vaginaValue', `${player.gender.vagina}`)
        $vaginaContainer.append(vaginaDropdown)

        // $genitalContainer.append($('<div/>').wiki('Penis: $player.gender.penis'))
        // $genitalContainer.append($('<div/>').wiki('Testicals: $player.gender.balls'))
        // $genitalContainer.append($('<div/>').wiki('Vagina: $player.gender.vagina'))

        let $changeBtn = $('<div/>').append($('<button/>').wiki('Change').prop('disabled', player.credits < cost).click(() => {
            let newSpecies = $dropdown.find(':selected').text()
            player.species = newSpecies
            Engine.show()
        }))

        $(this.output)
            .append($speciesContainer)
            // .append($genitalContainer)
            .append($changeBtn)
    }
})

function createDropdown(list, name, selected) {
    let $dropdown = $(`<select name="${name}"/>`)
    _.each(list, (data, key) => {
        $dropdown.append($('<option/>').attr('value', key).prop('selected', key === selected).wiki(data))
    })
    return $dropdown
}