import storyConfig from './config.json'
import { items, loot, stores, species, measurements, skills, settings, attackSkill } from '@js/data'
import Macros from '@js/macro'
import Templates from '@js/template'
import { sizeArray } from '@controller/character/MeasurementController'
import { genderArray } from '@js/controller/character/GenderController'
import { pronounArray } from '@js/controller/character/PronounController'
import { logger } from '@util/Logging'

Config = { ...Config, ...storyConfig };
setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	$(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">')
	// Set State Variables
	variables().version = `v0.9.0`
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
})(Config, State, Story, Engine, Dialog, $(document));