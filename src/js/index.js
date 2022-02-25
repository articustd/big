import storyConfig from './config.json'
import { items, loot, stores, species, measurements, attacks, skills } from '@js/data'
import * as macros from '@js/macro'
import { sizeArray } from '@controller/character/MeasurementController'
import { genderArray } from '@js/controller/character/GenderController'
import { pronounArray } from '@js/controller/character/PronounController'

Config = { ...Config, ...storyConfig };
setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	// Set State Variables
	variables().version = `v0.6.1`
	variables().items = items.items
	variables().loot = loot;
	variables().stores = cloneObj(stores.stores);
	variables().species = species;
	variables().sizes = sizeArray();
	variables().bodyTypes = measurements.bodyTypes;
	variables().genders = genderArray();
	variables().time = { day: 1, hour: 0, min: 0 }
	variables().attacks = attacks;
	variables().skills = skills;
	variables().pronouns = pronounArray()
	variables().twelveHour = false
	variables().debug = storyConfig.debug
	// Register custom SugarCube macros
	// registerAlert(Macro, Dialog);

	// Register plugin modules
	// registerTitleMatchProperties({ State, Story, $document });

	// Register components
	// registerHeader($document);

	// Setup noreturn
	$document.on(':passagestart', function (ev) {
		if (!ev.passage.tags.includes('noreturn'))
			State.variables.return = ev.passage.title;
	});

	// Setup CombatLog scrolling
	$document.on(":passagedisplay", function (ev) {
		let syncPlayerScroll = false;
		let syncEnemyScroll = false;
		$("#PlayerCombatLog").scrollTop($(document).height());
		$("#PlayerCombatLog").on("scroll", function () {
			if (!syncPlayerScroll) {
				syncEnemyScroll = true
				$("#EnemyCombatLog").scrollTop($(this).scrollTop())
			}
			syncPlayerScroll = false
		})
		$("#EnemyCombatLog").on("scroll", function () {
			if (!syncEnemyScroll) {
				syncPlayerScroll = true
				$("#PlayerCombatLog").scrollTop($(this).scrollTop())
			}
			syncEnemyScroll = false
		})
	})
})(Config, State, Story, Engine, Dialog, $(document));

function cloneObj(obj) {
	return Object.assign({}, obj)
}
