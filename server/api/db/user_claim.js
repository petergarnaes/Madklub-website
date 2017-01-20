/**
 * Created by peter on 4/24/16.
 *
 * Users claims for third party authentication, like access tokens for granting access
 */
module.exports = function(sequelize, DataTypes) {
  var UserClaim = sequelize.define("UserClaim", {
    type: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      //associate: function(models) {
      //}
    }
  });

  return UserClaim;
};
