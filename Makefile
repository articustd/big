twee_dir=story/twee
config_dir=src/configs

prod:
	cp ${config_dir}/$@.js ${twee_dir}/js/config.js

dev:
	cp ${config_dir}/$@.js ${twee_dir}/js/config.js