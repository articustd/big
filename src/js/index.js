import storyConfig from './config.json'
import { items, loot, stores, species, measurements, skills, settings, attackSkill } from '@js/data'
import * as macros from '@js/macro'
import * as templates from '@js/template'
import { sizeArray } from '@controller/character/MeasurementController'
import { genderArray } from '@js/controller/character/GenderController'
import { pronounArray } from '@js/controller/character/PronounController'
import { logger } from '@util/Logging'

Config = { ...Config, ...storyConfig };
setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	$(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">')
	// Set State Variables
	variables().version = `v0.8.3`
	variables().items = items
	variables().loot = loot;
	variables().stores = stores;
	variables().species = species;
	variables().sizes = sizeArray();
	variables().bodyTypes = measurements.bodyTypes;
	variables().genders = genderArray();
	variables().time = { day: 1, hour: 0, min: 0 }
	variables().skills = skills;
	variables().pronouns = pronounArray()
	variables().debug = storyConfig.debug
	variables().settings = settings
	variables().numberTest = 1
	variables().attackSkill = attackSkill
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
