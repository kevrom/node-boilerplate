'use strict';

module.exports = function(sequelize, DataTypes) {
	var RefreshToken = sequelize.define('RefreshToken', {
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
				RefreshToken.belongsTo(models.User);
				RefreshToken.belongsTo(models.Client);
			}
		},
		instanceMethods: {},
		hooks: {},
		setterMethods: {},
		getterMethods: {}
	});

	return RefreshToken;
};
