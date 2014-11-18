/* UserProvider stores information for a User that logs in with a third-party
 * provider such as Facebook, Twitter, or Google
 */
'use strict';

module.exports = function(sequelize, DataTypes) {
	var UserProvider = sequelize.define('UserProvider', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			}
		},
		provider: DataTypes.STRING,
		providerId: DataTypes.STRING,
		name: DataTypes.STRING,
		gender: DataTypes.STRING,
		profileUrl: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				UserProvider.hasOne(models.User);
			}
		},
		instanceMethods: {},
		hooks: {}
	});

	return UserProvider;
};
