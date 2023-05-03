import storyConfig from './config.json'
import _ from 'lodash'
import Macros from '@js/Macros'
// import Templates from '@js/Templates'

import { LoadAttacksFromData } from '@Utils/Loaders/AttackLoader'
import { logger } from '@Utils/Logging'
// import { loadGameData, saveGameData } from '@util/SaveSystem'

Config = {
	...Config,
	...storyConfig,
	saves: {
		id: 'big',
		autoload: checkAutoload(),
		autosave: true,
		slots: 8,
		isAllowed: function () { return State.passage !== 'start' }
	}
};
setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	$(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">')
	let version = `v0.20.0`
	// Set State Variables
	variables().version = version
	variables().debug = storyConfig.debug

	LoadAttacksFromData()

	// Config loading
	Save.onLoad.add(function (save) {
		logger('Loading...')
		// loadGameData(save, version)
	})

	// Config saving
	Save.onSave.add(function (save, details) {
		// logger(save)
		switch (details.type) {
			case 'serialize':
				break
			case 'autosave':
			case 'disk':
			default:
			// save.GameData = saveGameData()
		}
	})

	// Setup noreturn
	$document.on(':passagestart', function (ev) {
		if (!ev.passage.tags.includes('noreturn'))
			variables().return = ev.passage.title;
	});

	$(document).on(':storyready', function (ev) {
		if (checkAutoload())
			Save.autosave.load()
		else
			Engine.show()
	})
})(Config, State, Story, Engine, Dialog, $(document));

function checkAutoload() {
	return State.passage !== 'start' && !_.isEmpty(State.passage) && Save.autosave.ok()
}