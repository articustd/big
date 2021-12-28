State.variables.version = `v0.3.0`

Config.history.controls = true;
Config.debug = true;

setup.ImagePath = "assets/";

/* Passage Tag Triggers */
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
	}
	if (ev.passage.tags.includes('combat') && State.variables.combat == false) {
		// State.variables.enemy = $.extend(true,{},State.variables.enemies[0])
		// State.variables.combat = true
	}
});

$(document).one(':storyready', function(ev) {
	State.variables.enemies = enemies;
	State.variables.items = items;
	State.variables.loot = loot;
	State.variables.stores = cloneObj(stores);
	State.variables.species = species;
	State.variables.sizes = sizes;
	State.variables.bodyTypes = bodyTypes;
	State.variables.genders = genders;
	State.variables.time = {day: 1, hour: 0, min: 0}
	State.variables.attacks = attacks;
	State.variables.skills = skills;

	generateCharacter(50,7,5,0,0)
});

function cloneObj(obj) {
	return Object.assign({},obj)
}

