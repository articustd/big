State.variables.version = `v0.4.0`

Config.history.controls = false;
Config.debug = false;

setup.ImagePath = "assets/";

/* Passage Tag Triggers */
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn'))
		State.variables.return = ev.passage.title;
});

// Refresh Combat Log Scroll
$(document).on(":passagedisplay", function(ev) {
	let syncPlayerScroll = false;
	let syncEnemyScroll = false;
	$("#PlayerCombatLog").scrollTop($(document).height());
	$("#PlayerCombatLog").on("scroll", function () {
		if(!syncPlayerScroll) {
			syncEnemyScroll = true
			$("#EnemyCombatLog").scrollTop($(this).scrollTop())
		}
		syncPlayerScroll = false
	})
	$("#EnemyCombatLog").on("scroll", function () {
		if(!syncEnemyScroll) {
			syncPlayerScroll = true
			$("#PlayerCombatLog").scrollTop($(this).scrollTop())
		}
		syncEnemyScroll = false
	})
})

$(document).one(':storyready', function (ev) {
	State.variables.items = items;
	State.variables.loot = loot;
	State.variables.stores = cloneObj(stores);
	State.variables.species = species;
	State.variables.sizes = sizeArray();
	State.variables.bodyTypes = bodyTypes;
	State.variables.genders = genderArray();
	State.variables.time = { day: 1, hour: 0, min: 0 }
	State.variables.attacks = attacks;
	State.variables.skills = skills;
	State.variables.pronouns = pronounArray()
	State.variables.debug = Config.debug
});

function cloneObj(obj) {
	return Object.assign({}, obj)
}