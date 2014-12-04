'use strict';
/* global describe, it, before, after, beforeEach, afterEach */
process.env.NODE_ENV = 'test';

var path    = require('path');
var should  = require('should');
var faker   = require('faker');
var request = require('supertest');

var app = require('../../../../app');
var db  = require(path.join(app.root, '/core/database'))(app);

var User         = db.User;
var fakeEmail    = faker.internet.email();
var fakePassword = faker.internet.password();
var fakeName     = faker.name.findName();

before(function(done) {
	app.sequelize.sync()
		.complete(function(err) {
			if (err) {
				done(err);
			}
			done();
		});
});

after(function(done) {
	done();
});

describe('User', function() {
	it('should create a user', function(done) {
		User
			.create({
				email: fakeEmail,
				password: fakePassword,
				name: fakeName
			})
			.success(function(user) {
				done();
			})
			.error(function(err) {
				done(err);
			});
	});

	it('should reject creating a user with same email', function(done) {
		User
			.create({
				email: fakeEmail,
				password: fakePassword,
				name: fakeName
			})
			.success(function(user) {
				done(Error('Duplicate user created'));
			})
			.error(function(err) {
				done();
			});
	});

	it('should find a user based on email', function(done) {
		User
			.find({
				where: {
					email: fakeEmail
				}
			})
			.success(function(user) {
				done();
			})
			.error(function(err) {
				done(err);
			});
	});

	it('should retrieve a user\'s profile', function(done) {
		User
			.find({
				where: {
					email: fakeEmail
				}
			})
			.success(function(user) {
				user
					.getUserProfile()
					.success(function(user) {
						done();
					})
					.error(function(err) {
						done(err);
					});
			})
			.error(function(err) {
				done(err);
			});
	});
});
