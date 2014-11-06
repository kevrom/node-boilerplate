'use strict';

var IndexController = {};

IndexController.index = function(req, res) {
	res.render('index', {
		title: 'Index'
	});
};

module.exports = IndexController;
