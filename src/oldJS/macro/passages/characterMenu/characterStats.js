export function characterStats() {
    let player = variables().player

    let $wrapper = $('<span/>').css('flex', '3');

    $wrapper.wiki(`''__Base Stats__''
                    Health: $player.stats.hlth/$player.stats.maxHlth
                    Strength: $player.stats.strg
                    Dexterity: $player.stats.dex
                    Constitution: $player.stats.con

                    ''__Experience Points__''
                    Muscle: $player.exp.muscle
                    Agility: $player.exp.agility
                    Physique: $player.exp.physique
                    Size: $player.exp.size
                    Fat: <<print $player.exp.fat * 100>>
                    Skill: $player.exp.skill
    `)

    return $wrapper
}