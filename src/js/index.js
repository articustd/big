import storyConfig from './config.json'
import { stores, settings } from '@js/data'
import Macros from '@js/macro'
import Templates from '@js/template'

import { logger } from '@util/Logging'
import { migrate } from './migrations'

Config = { ...Config, ...storyConfig };
setup.ImagePath = "assets/";

((Config, State, Story, Engine, Dialog, $document) => {
	$(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">')
	let version = `v0.10.0`
	// Set State Variables
	variables().version = version
	variables().stores = stores;
	variables().time = { day: 1, hour: 0, min: 0 }
	variables().debug = storyConfig.debug
	variables().settings = settings
	// Register custom SugarCube macros
	// registerAlert(Macro, Dialog);

	// Register plugin modules
	// registerTitleMatchProperties({ State, Story, $document });

	// Register components
	// registerHeader($document);

	// Config loading
	Save.onLoad.add(function (save) {
		logger('Loading...')
		migrate(save, version)
	})

	// Setup noreturn
	$document.on(':passagestart', function (ev) {
		if (!ev.passage.tags.includes('noreturn'))
			variables().return = ev.passage.title;
	});
})(Config, State, Story, Engine, Dialog, $(document));