'use strict';

var fs        = require('fs');
var path      = require('path');
var glob      = require('glob');
var Sequelize = require('sequelize');
var _         = require('lodash');

var _app = null;
var _sequelize = null;
var _models    = {};
var _modelsDir;

function _configure() {
	_modelsDir = path.join(_app.root, _app.config.get('paths.server'));
	_sequelize = new Sequelize(
		_app.config.get('database.table'),
		_app.config.get('database.username'),
		_app.config.get('database.password'),
		{
			dialect: _app.config.get('database.engine'),
			logging: false,
			define: {
				syncOnAssociation: true,
				timestamps: true
			}
		}
	);

	// Load all models in the models directory
	glob
		.sync(_modelsDir + '/**/models/*.js')
		.forEach(function(file) {
			var model = _sequelize.import(file);
			_models[model.name] = model;
		});

	// Execute associations for models
	Object.keys(_models).forEach(function(modelName) {
		if ('associate' in _models[modelName]) {
			_models[modelName].associate(_models);
		}
	});

}

function init(app) {
	_app = app;
	_configure();
	_app.models = _models;
	_app.sequelize = _sequelize;
	_app.Sequelize = Sequelize;
}

// Public API
module.exports.init      = init;
