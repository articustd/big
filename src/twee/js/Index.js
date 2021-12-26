State.variables.version = `v0.2.0`

Config.history.controls = false;
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
	State.variables.stores = Object.assign({},stores);
	State.variables.species = species;
	State.variables.genders = genders;
	State.variables.time = {day: 1, hour: 0, min: 0}
});

