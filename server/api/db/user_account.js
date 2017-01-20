/**
 * Created by peter on 4/24/16.
 *
 * All account details that are mostly hidden for the user, and only certain fields are mutable
 */

module.exports = function(sequelize, DataTypes) {
  var UserAccount = sequelize.define("UserAccount", {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    email_confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password_hash: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    phone_number_confirmed: DataTypes.BOOLEAN, // Unused for now
    two_factor_enabled: DataTypes.BOOLEAN, // Whether or not we have two factor authenticated
    lockout_end: DataTypes.DATE,
    lockout_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    access_failed_count: { // When tried 3 times, lockout for an hour?
      type: DataTypes.INTEGER,
      defaultValue: 0
    }

  }, {
    classMethods: {
      associate: function(models) {
        // As of now, user to user account is 1:1
        UserAccount.User = UserAccount.belongsTo(models.User,{
          foreignKey: 'userId',
          as: 'user',
          onUpdate: 'cascade',
          onDelete: 'cascade',
        });
      }
    }
  });

  return UserAccount;
};
