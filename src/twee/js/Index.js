State.variables.version = `v0.4.0`

Config.history.controls = false;
Config.debug = true;

setup.ImagePath = "assets/";

/* Passage Tag Triggers */
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn'))
		State.variables.return = ev.passage.title;
});

$(document).one(':storyready', function(ev) {
	State.variables.items = items;
	State.variables.loot = loot;
	State.variables.stores = cloneObj(stores);
	State.variables.species = species;
	State.variables.sizes = sizeArray();
	State.variables.bodyTypes = bodyTypes;
	State.variables.genders = genderArray();
	State.variables.time = {day: 1, hour: 0, min: 0}
	State.variables.attacks = attacks;
	State.variables.skills = skills;
	State.variables.pronouns = pronounArray()
});

function cloneObj(obj) {
	return Object.assign({},obj)
}