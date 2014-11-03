'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = require('lodash');

var sequelize = null;
var models    = {};
var modelsDir;

function _configure() {

	// Load all models in the models directory
	fs
		.readdirSync(modelsDir)
		.forEach(function(file) {
			var model = sequelize.import(path.join(modelsDir, file));
			models[model.name] = model;
		});

	// Execute associations for models
	Object.keys(models).forEach(function(modelName) {
		if ('associate' in models[modelName]) {
			models[modelName].associate(models);
		}
	});

}

function getModels(model) {
	if (!model) {
		return models;
	}
	return models[model];
}

function init(app) {
	modelsDir = path.join(app.root, app.config.get('paths.server'), 'models');
	sequelize = new Sequelize(
		app.config.get('database.table'),
		app.config.get('database.username'),
		app.config.get('database.password'),
		{
			dialect: app.config.get('database.engine'),
			logging: false,
			define: {
				syncOnAssociation: true,
				timestamps: true
			}
		}
	);

	_configure();
}

// Public API
module.exports.init      = init;
module.exports.getModels = getModels;
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
