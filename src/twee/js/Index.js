Config.history.controls = true;
Config.debug = true;

/* Passage Tag Triggers */
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
	}
	if (ev.passage.tags.includes('combat') && State.variables.combat == false) {
		State.variables.enemy = $.extend(true,{},State.variables.enemies[0])
		State.variables.combat = true
	}
});

$(document).one(':storyready', function(ev) {
	State.variables.enemies = enemies;
	State.variables.items = items;
	State.variables.loot = loot;
});

