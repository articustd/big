import { getScene } from "@js/GameEngine/GameCore"

Template.add('EnemyName', function() {
    return getScene('MainLoop').enemy.name
})