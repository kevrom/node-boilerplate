'use strict';

module.exports = function(sequelize, DataTypes) {
	var AccessToken = sequelize.define('AccessToken', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		token: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				AccessToken.belongsTo(models.User);
				AccessToken.belongsTo(models.Client);
			}
		},
		instanceMethods: {},
		hooks: {},
		setterMethods: {},
		getterMethods: {}
	});

	return AccessToken;
};
