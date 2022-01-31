function characterStats() {
    let player = State.variables.player

    let $wrapper = $('<span/>')

    $wrapper.wiki(`''__Base Stats__''
                    Health: $player.stats.hlth/$player.stats.maxHlth
                    Strength: $player.stats.strg
                    Constitution: $player.stats.con
                    Dexterity: $player.stats.dex
                    Accuracy: $player.stats.acc

                    ''__Experience Points__''
                    Muscle: $player.exp.muscle
                    Fat: <<print $player.exp.fat * 100>>
                    Size: $player.exp.size
                    Agility: $player.exp.agility
                    Paw-Eye Coordination: $player.exp.pawEye
                    Skill: $player.exp.skill
    `)

    return $wrapper
}