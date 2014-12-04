'use strict';

module.exports = function(sequelize, DataTypes) {
	var Client = sequelize.define('Client', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		clientID: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		clientSecret: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		}
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Client.belongsTo(models.User);
			}
		},
		instanceMethods: {},
		hooks: {},
		setterMethods: {},
		getterMethods: {}
	});

	return Client;
};
