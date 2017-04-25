/**
 * Created by peter on 4/23/16.
 */
//var config = require("../../config");

module.exports = function(sequelize, DataTypes) {
  var Kitchen = sequelize.define("Kitchen", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {type: DataTypes.STRING, allowNull: false},
    picture: {
      type: DataTypes.STRING,
      validate: { // Could be better, maybe validate through regex it begins with 'http://${host}' ??
        isUrl: true,
        //contains: config.host
      }
    }, // Url of image, mutations sh
    rule_set: {
      type: DataTypes.TEXT,
      defaultValue: 'Rules of the kitchen'
    },
    default_mealtime: {
      type: DataTypes.STRING,
      defaultValue: '19:00:00',
      validate: {
        // Regular expression matching if it is valid time matching HH:MM:SS
        is: /^([01]\d|2[0123])(:([0-5]\d)){2}$/
      }
    },
    // How must time before 'at' it is legal to cancel, in minutes
    cancellation_deadline: {
      type: DataTypes.INTEGER,
      // If 0, this restriction is disabled
      defaultValue: 0
    },
    // How must time before 'at' it is legal to have shopped, in minutes
    shopping_open_at: {
      type: DataTypes.INTEGER,
      // If 0, this restriction is disabled
      defaultValue: 0
    },
    priceloft_applies: { // Wether a price loft is enforced, some might don't care
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    default_priceloft: { // The maximum per person price of a meal
      type: DataTypes.FLOAT,
      defaultValue: 100.0
    },
    assume_attendance: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }, // Whether a kitchen member should actively opt out of meals
    default_period_length: { // Specified as a string following the ISO 8601 duration
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        // Regex for ISO 8601 durations
        is: /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d+[HMS])(\d+H)?(\d+M)?(\d+S)?)?$/
      }
    },
    mandatory_dinnerclubs_in_period: { // Indicates how many times a participant
      // is supposed to cook in a period. If 0, there are nothing mandatory
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        Kitchen.Members = Kitchen.hasMany(models.User,{
          as: 'member',
          foreignKey: {
            name: 'memberId'
          }
        });
        Kitchen.DinnerClubs = Kitchen.hasMany(models.DinnerClub,{
          as: 'dinnerclub',
          onDelete: "CASCADE",
          foreignKey: {
            name: 'associatedKitchenId'
          }
        });
        Kitchen.Periods = Kitchen.hasMany(models.Period,{
          as: 'period',
          onDelete: "CASCADE",
          foreignKey: {
            name: 'periodKitchenId'
          }
        });
        // We want kitchen to point to only one user, not the other way
        Kitchen.Admin = Kitchen.belongsTo(models.User,{
          as: 'admin',
          foreignKey: {
            name: 'adminId'
          },
          // To avoid cyclic dependency
          constraints: false
        })
      }
    }
  });

  return Kitchen;
};
