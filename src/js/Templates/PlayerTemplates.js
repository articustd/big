import { getScene } from "@js/GameEngine/GameCore"

Template.add('PlayerName', function() {
    return getScene('MainLoop').player.name
})