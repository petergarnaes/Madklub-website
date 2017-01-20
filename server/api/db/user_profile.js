/**
 * Created by peter on 4/24/16.
 *
 * Third party information like profile id
 */
module.exports = function(sequelize, DataTypes) {
  var UserLogin = sequelize.define("UserLogin", {
    type: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      //associate: function(models) {
      //}
    }
  });

  return UserLogin;
};
